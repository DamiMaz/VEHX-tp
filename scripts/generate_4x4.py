#!/usr/bin/env python3
"""
================================================================================
FORD RANGER RAPTOR 4x4 V6 - PROCEDURAL 3D GLB GENERATOR
Target: 4x4.glb (glTF 2.0 Binary, ~35k tris)
================================================================================
"""

import struct, json, math, sys, os
from pathlib import Path
import numpy as np
import trimesh

# ---- Outputs ----------------------------------------------------------------
OUT_PATHS = [
    Path(r"E:\Repositorio 2026\Trabajo Final de Programacion\frontend\public\models\4x4.glb"),
    Path(r"E:\Repositorio 2026\Trabajo Final de Programacion\public\4x4.glb"),
    Path(r"E:\Repositorio 2026\Trabajo Final de Programacion\frontend\public\4x4.glb")
]
for p in OUT_PATHS:
    p.parent.mkdir(parents=True, exist_ok=True)

# ---- Dimensions (m) --------------------------------------------------------
LENGTH = 5.36;   WIDTH = 2.03;   HEIGHT = 1.93
WHEELBASE = 3.27; GROUND_CLEARANCE = 0.27
WHEEL_RADIUS = 0.42; TIRE_WIDTH = 0.285
TRACK_F = 1.71;  TRACK_R = 1.71
FRONT_AXLE_Z =  WHEELBASE / 2
REAR_AXLE_Z  = -WHEELBASE / 2
HALF_L = LENGTH / 2;  HW = WIDTH / 2

# ---- Colours (sRGB -> linear) ---------------------------------------------
def srgb_to_lin(h):
    h = h.lstrip('#')
    s = np.array([int(h[i:i+2],16)/255.0 for i in (0,2,4)])
    return list(np.where(s<=0.04045, s/12.92, ((s+0.055)/1.055)**2.4))

COL_BODY    = srgb_to_lin("#1B232B")  # River Styx metallic
COL_GRILLE  = srgb_to_lin("#16191D")  # Matte Black Ford Grille
COL_SKID    = srgb_to_lin("#8C9398")  # Heavy Brushed Alloy Skid Plate
COL_POWDER  = srgb_to_lin("#1A1D20")  # Tubular Rock Sliders & Sports Bar
COL_AMBER   = srgb_to_lin("#CA9C68")  # Amber Autumn C-Clamp DRL
COL_RED     = srgb_to_lin("#E02424")  # Ruby Red Taillights
COL_GLASS   = srgb_to_lin("#0B0F13")  # Dark tint
COL_BEAD_O  = srgb_to_lin("#594C3D")  # Afternoon Tea Beadlock Ring Accent
COL_BEAD_I  = srgb_to_lin("#22272B")  # Charcoal Inner Hub
COL_TIRE    = srgb_to_lin("#121416")  # All-Terrain Rubber
COL_INT     = srgb_to_lin("#0A0C0E")  # Dark interior

# =============================================================================
#  GEOMETRY HELPERS
# =============================================================================

def loft(profiles, close_caps=True):
    n_prof = len(profiles)
    n_pts  = len(profiles[0])
    verts  = np.vstack(profiles)
    faces  = []
    for i in range(n_prof - 1):
        a0 = i * n_pts;  b0 = (i+1) * n_pts
        for j in range(n_pts):
            j1 = (j+1) % n_pts
            a, b, c, d = a0+j, a0+j1, b0+j1, b0+j
            faces += [[a,b,c],[a,c,d]]
    if close_caps:
        ci = len(verts); ctr = profiles[0].mean(axis=0)
        verts = np.vstack([verts, ctr.reshape(1,3)])
        for j in range(n_pts):
            faces.append([ci, j, (j+1)%n_pts])
        ci2 = len(verts); ctr2 = profiles[-1].mean(axis=0)
        verts = np.vstack([verts, ctr2.reshape(1,3)])
        r0 = (n_prof-1)*n_pts
        for j in range(n_pts):
            faces.append([ci2, r0+(j+1)%n_pts, r0+j])
    return trimesh.Trimesh(vertices=verts, faces=np.array(faces), process=True)

def _box(ex, ey, ez, tx, ty, tz):
    return trimesh.creation.box([ex,ey,ez],
        trimesh.transformations.translation_matrix([tx,ty,tz]))

def _cyl(r, h, tx, ty, tz, axis='z', sections=24):
    c = trimesh.creation.cylinder(radius=r, height=h, sections=sections)
    if axis == 'x':
        c.apply_transform(trimesh.transformations.rotation_matrix(math.pi/2, [0,1,0]))
    elif axis == 'z':
        c.apply_transform(trimesh.transformations.rotation_matrix(math.pi/2, [1,0,0]))
    c.apply_translation([tx, ty, tz])
    return c

# =============================================================================
#  RAPTOR BODY GENERATION (Double Cab + Pick-Up Cargo Bed)
# =============================================================================

def cab_cross_section(z, w_half, y_floor, y_belt, y_roof, w_roof_half, n_pts=64):
    pts = []
    seg = n_pts // 4
    # Bottom
    for i in range(seg):
        t = i / seg
        x = -w_half + 2*w_half*t
        pts.append([x, y_floor, z])
    # Right muscular truck side
    for i in range(seg):
        t = (i+1) / seg
        y = y_floor + (y_belt - y_floor)*t
        bulge = math.sin(t*math.pi)*0.03
        pts.append([w_half + bulge, y, z])
    # Right cab greenhouse
    seg_hi = seg // 2
    for i in range(seg_hi):
        t = (i+1) / seg_hi
        y = y_belt + (y_roof - y_belt)*t
        x = w_half - (w_half - w_roof_half)*t
        pts.append([x, y, z])
    # Roof
    for i in range(seg):
        t = (i+1) / seg
        x = w_roof_half - 2*w_roof_half*t
        crown = math.sin(t*math.pi)*0.02
        pts.append([x, y_roof + crown, z])
    # Left cab greenhouse
    for i in range(seg_hi):
        t = (i+1) / seg_hi
        y = y_roof - (y_roof - y_belt)*t
        x = -(w_roof_half + (w_half - w_roof_half)*t)
        pts.append([x, y, z])
    # Left truck side
    for i in range(seg - 1):
        t = (i+1) / seg
        y = y_belt - (y_belt - y_floor)*t
        bulge = math.sin((1-t)*math.pi)*0.03
        pts.append([-(w_half + bulge), y, z])
    return np.array(pts)

def generate_raptor_cab():
    GC = GROUND_CLEARANCE
    # Passenger Double Cab lofting profiles
    stations = [
        # Front Raptor Grille & Nose
        ( HALF_L,          HW*0.65, GC+0.35, GC+0.85, GC+0.85, HW*0.45),
        ( HALF_L-0.12,     HW*0.88, GC+0.22, GC+0.98, GC+0.98, HW*0.60),
        ( HALF_L-0.30,     HW*0.98, GC+0.12, GC+1.08, GC+1.08, HW*0.68),
        # Hood with power bulges
        ( FRONT_AXLE_Z+0.40, HW*1.00, GC+0.05, GC+1.12, GC+1.12, HW*0.72),
        ( FRONT_AXLE_Z+0.00, HW*1.00, GC+0.02, GC+1.12, GC+1.22, HW*0.74),
        # Windshield base
        ( FRONT_AXLE_Z-0.35, HW*1.00, GC,      GC+1.12, HEIGHT-0.02, HW*0.78),
        ( 0.60,             HW*1.00, GC,      GC+1.12, HEIGHT,      HW*0.80),
        # Crew Cab Mid & B-pillar
        ( 0.10,             HW*1.00, GC,      GC+1.12, HEIGHT,      HW*0.80),
        (-0.40,             HW*1.00, GC,      GC+1.12, HEIGHT,      HW*0.80),
        # Rear Cab Wall (C-pillar)
        (-0.85,             HW*1.00, GC,      GC+1.12, HEIGHT,      HW*0.78),
        (-0.95,             HW*0.96, GC+0.08, GC+1.10, HEIGHT-0.04, HW*0.74)
    ]
    raw = [cab_cross_section(*s, n_pts=64) for s in stations]
    target_n = min(len(p) for p in raw)
    profiles = [p[np.linspace(0, len(p)-1, target_n, dtype=int)] for p in raw]
    return loft(profiles, close_caps=True)

def generate_raptor_bed():
    """Rear open cargo pick-up bed with flared fenders and stamped tailgate."""
    GC = GROUND_CLEARANCE
    parts = []
    # Cargo bed floor
    bed_len = 1.62
    bed_z = -1.82
    parts.append(_box(WIDTH*0.86, 0.08, bed_len, 0, GC+0.42, bed_z))
    # Bed side walls (thick flared truck bed walls)
    for s in [-1, 1]:
        parts.append(_box(0.14, 0.58, bed_len, s*(HW*0.92), GC+0.72, bed_z))
    # Front bulkhead wall facing cabin
    parts.append(_box(WIDTH*0.90, 0.58, 0.10, 0, GC+0.72, -1.02))
    # Stamped Tailgate
    parts.append(_box(WIDTH*0.90, 0.58, 0.12, 0, GC+0.72, -HALF_L+0.08))
    # Bed floor liner ribs
    for i in range(5):
        parts.append(_box(0.04, 0.02, bed_len*0.95, (i-2)*0.24, GC+0.47, bed_z))
    return trimesh.util.concatenate(parts)

def generate_sports_bar():
    """Tubular black sports roll bar mounted in the cargo bed."""
    GC = GROUND_CLEARANCE
    parts = []
    bar_h = 0.65
    bar_y = GC + 1.05
    # Main roll hoop arch
    parts.append(_box(WIDTH*0.78, 0.06, 0.06, 0, bar_y + bar_h, -1.15))
    for s in [-1, 1]:
        # Upright legs
        parts.append(_box(0.06, bar_h, 0.06, s*(HW*0.80), bar_y + bar_h/2, -1.15))
        # Angled rear brace struts
        brace = _box(0.05, 0.05, 0.85, s*(HW*0.80), bar_y + bar_h/2, -1.55)
        brace.apply_transform(trimesh.transformations.rotation_matrix(math.radians(-25), [1,0,0]))
        parts.append(brace)
    return trimesh.util.concatenate(parts)

def generate_skid_plate():
    """Heavy-duty brushed aluminum front bash plate."""
    GC = GROUND_CLEARANCE
    parts = []
    # Angled front skid plate beneath bumper
    plate = _box(WIDTH*0.58, 0.03, 0.65, 0, GC+0.16, HALF_L-0.28)
    plate.apply_transform(trimesh.transformations.rotation_matrix(math.radians(22), [1,0,0]))
    parts.append(plate)
    # Tow hooks (red accents on skid plate)
    for s in [-1, 1]:
        hook = _box(0.06, 0.08, 0.12, s*0.25, GC+0.12, HALF_L-0.08)
        parts.append(hook)
    return trimesh.util.concatenate(parts)

def generate_side_steps():
    """Cast aluminum tubular rock sliders with step pads."""
    GC = GROUND_CLEARANCE
    parts = []
    step_len = 2.10
    for s in [-1, 1]:
        # Main tubular bar
        parts.append(_box(0.12, 0.05, step_len, s*(HW+0.06), GC+0.12, 0.15))
        # Step brackets
        for z in [0.95, 0.15, -0.65]:
            parts.append(_box(0.10, 0.06, 0.08, s*(HW), GC+0.15, z))
    return trimesh.util.concatenate(parts)

def generate_raptor_grille_and_trim():
    """Block FORD grille and hood extractors."""
    GC = GROUND_CLEARANCE
    parts = []
    # Front grille block with bold contour
    parts.append(_box(WIDTH*0.74, 0.38, 0.10, 0, GC+0.65, HALF_L-0.05))
    # Stamped block FORD center bar
    parts.append(_box(WIDTH*0.52, 0.14, 0.05, 0, GC+0.66, HALF_L-0.02))
    # Functional hood heat extractors
    for s in [-1, 1]:
        parts.append(_box(0.18, 0.03, 0.40, s*0.35, GC+1.14, FRONT_AXLE_Z+0.45))
    # Muscular flared wheel arches (4)
    for z in [FRONT_AXLE_Z, REAR_AXLE_Z]:
        for s in [-1, 1]:
            arch = _box(0.08, WHEEL_RADIUS*1.35, WHEEL_RADIUS*2.3, s*(HW+0.04), WHEEL_RADIUS*1.15, z)
            parts.append(arch)
    # Dual rear 2.5" exhaust tips
    for s in [-1, 1]:
        parts.append(_box(0.09, 0.06, 0.12, s*0.52, GC+0.18, -HALF_L+0.02))
    return trimesh.util.concatenate(parts)

def generate_raptor_glass():
    GC = GROUND_CLEARANCE
    parts = []
    # Windshield (upright, imposing)
    parts.append(_box(WIDTH*0.75, 0.52, 0.03, 0, GC+1.46, FRONT_AXLE_Z-0.10))
    # Side cab windows
    for s in [-1, 1]:
        parts.append(_box(0.02, 0.40, 1.45, s*(HW*0.78), GC+1.42, 0.05))
    # Rear cab privacy glass window
    parts.append(_box(WIDTH*0.70, 0.36, 0.03, 0, GC+1.40, -0.92))
    return trimesh.util.concatenate(parts)

def generate_raptor_interior():
    GC = GROUND_CLEARANCE
    parts = []
    # Rugged truck dashboard
    parts.append(_box(WIDTH*0.75, 0.26, 0.40, 0, GC+1.12, FRONT_AXLE_Z-0.25))
    # Center 12" screen
    parts.append(_box(0.20, 0.22, 0.04, 0, GC+1.26, FRONT_AXLE_Z-0.22))
    # Sport front seats with side bolsters
    for s in [-1, 1]:
        parts.append(_box(0.48, 0.52, 0.48, s*0.40, GC+0.78, 0.10))
        parts.append(_box(0.44, 0.56, 0.16, s*0.40, GC+1.12, -0.12))
    return trimesh.util.concatenate(parts)

def generate_raptor_lights():
    GC = GROUND_CLEARANCE
    # Signature C-clamp Matrix LED headlights
    h_parts = []
    for s in [-1, 1]:
        # Upper horizontal bar
        h_parts.append(_box(0.28, 0.06, 0.06, s*0.62, GC+0.82, HALF_L-0.08))
        # Outer vertical C-bracket
        h_parts.append(_box(0.06, 0.28, 0.06, s*0.74, GC+0.70, HALF_L-0.08))
        # Lower horizontal bar
        h_parts.append(_box(0.24, 0.06, 0.06, s*0.64, GC+0.58, HALF_L-0.08))
    headlights = trimesh.util.concatenate(h_parts)

    # Vertical rear taillights on bed corners
    t_parts = []
    for s in [-1, 1]:
        t_parts.append(_box(0.12, 0.42, 0.08, s*(HW*0.88), GC+0.78, -HALF_L+0.10))
    taillights = trimesh.util.concatenate(t_parts)

    return headlights, taillights

def generate_raptor_wheel():
    """33-inch All-Terrain KO2 tire + 17-inch beadlock wheel."""
    R = WHEEL_RADIUS
    W = TIRE_WIDTH
    # Deep tread All-Terrain tire
    tire = _cyl(R, W, 0, 0, 0, axis='x', sections=64)
    tv, tf = trimesh.remesh.subdivide(tire.vertices, tire.faces)
    tire = trimesh.Trimesh(vertices=tv, faces=tf, process=True)

    # Beadlock outer ring with afternoon tea bronze accent
    bead_o = _cyl(R*0.70, W+0.012, 0, 0, 0, axis='x', sections=48)
    # Simulated beadlock bolts
    bolts = []
    for i in range(12):
        ang = 2 * math.pi * i / 12
        bolt = _box(W+0.018, 0.02, 0.02, 0, (R*0.64)*math.cos(ang), (R*0.64)*math.sin(ang))
        bolts.append(bolt)
    bead_o = trimesh.util.concatenate([bead_o] + bolts)

    # Inner wheel hub with heavy 6-spoke Raptor pattern
    spokes = []
    for i in range(6):
        ang = 2 * math.pi * i / 6
        spoke = _box(W+0.016, R*0.52, 0.07, 0, (R*0.28)*math.cos(ang), (R*0.28)*math.sin(ang))
        spokes.append(spoke)
    bead_i = _cyl(R*0.48, W+0.014, 0, 0, 0, axis='x', sections=32)
    bead_i = trimesh.util.concatenate([bead_i] + spokes)

    return tire, bead_o, bead_i

# =============================================================================
#  GLB BUILDER
# =============================================================================

class GLB:
    def __init__(self):
        self.nodes=[]; self.meshes=[]; self.materials=[]; self.accessors=[]
        self.buffer_views=[]; self.buf=bytearray(); self.animations=[]
        self.scenes=[{"nodes":[]}]; self.ext=set()

    def _pad4(self):
        r = len(self.buf)%4
        if r: self.buf.extend(b'\x00'*(4-r))

    def _bv(self, data, tgt=None):
        self._pad4(); off=len(self.buf); self.buf.extend(data)
        bv={"buffer":0,"byteOffset":off,"byteLength":len(data)}
        if tgt: bv["target"]=tgt
        i=len(self.buffer_views); self.buffer_views.append(bv); return i

    def _acc(self, bvi, ct, cnt, tp, mn=None, mx=None):
        a={"bufferView":bvi,"componentType":ct,"count":cnt,"type":tp}
        if mn is not None: a["min"]=mn
        if mx is not None: a["max"]=mx
        i=len(self.accessors); self.accessors.append(a); return i

    def mat(self, name, rgba, met=0, rough=0.5, emf=None, ems=None,
            cc=None, ccr=None, trans=None, ds=False):
        m={"name":name,"pbrMetallicRoughness":{
            "baseColorFactor":list(rgba),"metallicFactor":met,"roughnessFactor":rough},
            "doubleSided":ds}
        m["alphaMode"] = "BLEND" if rgba[3]<1.0 else "OPAQUE"
        if emf:
            if ems and ems>1:
                m["emissiveFactor"]=[min(e,1.0) for e in emf]
                m.setdefault("extensions",{})["KHR_materials_emissive_strength"]={"emissiveStrength":ems}
                self.ext.add("KHR_materials_emissive_strength")
            else:
                m["emissiveFactor"]=list(emf)
        if cc is not None:
            m.setdefault("extensions",{})["KHR_materials_clearcoat"]={"clearcoatFactor":cc,"clearcoatRoughnessFactor":ccr or 0}
            self.ext.add("KHR_materials_clearcoat")
        if trans is not None:
            m.setdefault("extensions",{})["KHR_materials_transmission"]={"transmissionFactor":trans}
            self.ext.add("KHR_materials_transmission")
            m["alphaMode"]="BLEND"
        i=len(self.materials); self.materials.append(m); return i

    def mesh(self, tm, mi, name="m"):
        tm.fix_normals()
        v=np.asarray(tm.vertices,dtype=np.float32)
        n=np.asarray(tm.vertex_normals,dtype=np.float32)
        idx=np.asarray(tm.faces,dtype=np.uint32).flatten()
        vbv=self._bv(v.tobytes(),34962)
        nbv=self._bv(n.tobytes(),34962)
        ibv=self._bv(idx.tobytes(),34963)
        pa=self._acc(vbv,5126,len(v),"VEC3",v.min(0).tolist(),v.max(0).tolist())
        na=self._acc(nbv,5126,len(n),"VEC3")
        ia=self._acc(ibv,5125,len(idx),"SCALAR",[int(idx.min())],[int(idx.max())])
        m={"name":name,"primitives":[{"attributes":{"POSITION":pa,"NORMAL":na},"indices":ia,"material":mi}]}
        i=len(self.meshes); self.meshes.append(m); return i

    def node(self, name, mi=None, ch=None, t=None, r=None, s=None):
        nd={"name":name}
        if mi is not None: nd["mesh"]=mi
        if ch: nd["children"]=ch
        if t: nd["translation"]=list(t)
        if r: nd["rotation"]=list(r)
        if s: nd["scale"]=list(s)
        i=len(self.nodes); self.nodes.append(nd); return i

    def anim(self, root, wheels, dur=10.0, fps=30):
        nf=int(dur*fps)+1
        ts=np.linspace(0,dur,nf,dtype=np.float32)
        # Turntable 360 rotation Y
        rr=np.zeros((nf,4),np.float32)
        for i,t in enumerate(ts):
            a=2*math.pi*t/dur
            rr[i]=[0,math.sin(a/2),0,math.cos(a/2)]
        # Heavy off-road suspension travel Y
        rt=np.zeros((nf,3),np.float32)
        for i,t in enumerate(ts):
            rt[i]=[0, 0.020*math.sin(2*math.pi*t/dur), 0]
        # Wheel spin X
        wr=np.zeros((nf,4),np.float32)
        for i,t in enumerate(ts):
            a=2*math.pi*4*t/dur
            wr[i]=[math.sin(a/2),0,0,math.cos(a/2)]
        tbv=self._bv(ts.tobytes()); ta=self._acc(tbv,5126,nf,"SCALAR",[float(ts[0])],[float(ts[-1])])
        rrbv=self._bv(rr.tobytes()); rra=self._acc(rrbv,5126,nf,"VEC4")
        rtbv=self._bv(rt.tobytes()); rta=self._acc(rtbv,5126,nf,"VEC3")
        wrbv=self._bv(wr.tobytes()); wra=self._acc(wrbv,5126,nf,"VEC4")
        samp=[
            {"input":ta,"output":rra,"interpolation":"LINEAR"},
            {"input":ta,"output":rta,"interpolation":"LINEAR"},
        ]
        chan=[
            {"sampler":0,"target":{"node":root,"path":"rotation"}},
            {"sampler":1,"target":{"node":root,"path":"translation"}},
        ]
        for w in wheels:
            si=len(samp)
            samp.append({"input":ta,"output":wra,"interpolation":"LINEAR"})
            chan.append({"sampler":si,"target":{"node":w,"path":"rotation"}})
        self.animations.append({"name":"Turntable","samplers":samp,"channels":chan})

    def export(self, path):
        self._pad4()
        j={"asset":{"version":"2.0","generator":"VEHX-4x4-RangerRaptor-v1"},
           "scene":0,"scenes":self.scenes,"nodes":self.nodes,"meshes":self.meshes,
           "materials":self.materials,"accessors":self.accessors,
           "bufferViews":self.buffer_views,"buffers":[{"byteLength":len(self.buf)}]}
        if self.animations: j["animations"]=self.animations
        if self.ext: j["extensionsUsed"]=list(self.ext)
        jb=json.dumps(j,separators=(',',':')).encode()
        jp=(4-len(jb)%4)%4; jb+=b' '*jp
        bd=bytes(self.buf); bp=(4-len(bd)%4)%4; bd+=b'\x00'*bp
        tot=12+8+len(jb)+8+len(bd)
        hdr=struct.pack('<III',0x46546C67,2,tot)
        jch=struct.pack('<II',len(jb),0x4E4F534A)
        bch=struct.pack('<II',len(bd),0x004E4942)
        with open(path,'wb') as f:
            f.write(hdr+jch+jb+bch+bd)
        return tot

# =============================================================================
#  MAIN EXECUTION
# =============================================================================

def main():
    print("="*70)
    print("  FORD RANGER RAPTOR 4x4 V6 - GLB GENERATOR")
    print("="*70)
    g = GLB()

    print("[1/6] Materials...")
    m_body  = g.mat("CarPaint_RiverStyx",    COL_BODY+[1],   met=0.88, rough=0.22, cc=0.95, ccr=0.05)
    m_grill = g.mat("Grille_MatteBlack",     COL_GRILLE+[1], met=0.08, rough=0.75)
    m_skid  = g.mat("SkidPlate_Steel",       COL_SKID+[1],   met=0.95, rough=0.28)
    m_tubul = g.mat("PowderCoat_Tubular",    COL_POWDER+[1], met=0.40, rough=0.70)
    m_amb   = g.mat("Emissive_AmberAutumn",  COL_AMBER+[1],  met=0.30, rough=0.30, emf=COL_AMBER, ems=3.2)
    m_red   = g.mat("Emissive_RubyRed",     COL_RED+[1],    met=0.30, rough=0.30, emf=COL_RED,   ems=2.2)
    m_gls   = g.mat("Glass_DarkTint",        COL_GLASS+[0.20],met=0.90,rough=0.06, trans=0.80, ds=True)
    m_beado = g.mat("Beadlock_Ring_Outer",   COL_BEAD_O+[1], met=0.75, rough=0.30)
    m_beadi = g.mat("Beadlock_Hub_Inner",    COL_BEAD_I+[1], met=0.80, rough=0.35)
    m_tire  = g.mat("Rubber_AllTerrain",     COL_TIRE+[1],   met=0.00, rough=0.88)
    m_int   = g.mat("Interior_Dark",         COL_INT+[1],    met=0.10, rough=0.85)

    print("[2/6] Building Raptor 4x4 Cab, Bed & Accessories...")
    cab_mesh  = generate_raptor_cab()
    cv, cf    = trimesh.remesh.subdivide(cab_mesh.vertices, cab_mesh.faces)
    cab_mesh  = trimesh.Trimesh(vertices=cv, faces=cf, process=True)

    bed_mesh  = generate_raptor_bed()
    bv, bf    = trimesh.remesh.subdivide(bed_mesh.vertices, bed_mesh.faces)
    bed_mesh  = trimesh.Trimesh(vertices=bv, faces=bf, process=True)

    sports_bar = generate_sports_bar()
    skid_plate = generate_skid_plate()
    side_steps = generate_side_steps()
    grille_trim= generate_raptor_grille_and_trim()
    glass      = generate_raptor_glass()
    interior   = generate_raptor_interior()
    hdl, tll   = generate_raptor_lights()

    print("[3/6] Generating 33-inch All-Terrain Beadlock Wheels...")
    tire_m, bead_o_m, bead_i_m = generate_raptor_wheel()

    print("[4/6] Assembling scene graph...")
    cab_mi    = g.mesh(cab_mesh,   m_body,  "Body_Cab_mesh")
    bed_mi    = g.mesh(bed_mesh,   m_body,  "Body_Bed_mesh")
    sbar_mi   = g.mesh(sports_bar, m_tubul, "Sports_Bar_mesh")
    skid_mi   = g.mesh(skid_plate, m_skid,  "SkidPlate_Front_mesh")
    step_mi   = g.mesh(side_steps, m_tubul, "Side_Steps_mesh")
    grill_mi  = g.mesh(grille_trim,m_grill, "Grille_Trim_mesh")
    gls_mi    = g.mesh(glass,      m_gls,   "Glass_Windows_mesh")
    int_mi    = g.mesh(interior,   m_int,   "Interior_Cockpit_mesh")
    hdl_mi    = g.mesh(hdl,        m_amb,   "Lights_DRL_mesh")
    tll_mi    = g.mesh(tll,        m_red,   "Lights_Tail_mesh")

    cab_nd   = g.node("Body_Cab",          mi=cab_mi)
    bed_nd   = g.node("Body_Bed",          mi=bed_mi)
    sbar_nd  = g.node("Sports_Bar",        mi=sbar_mi)
    skid_nd  = g.node("SkidPlate_Front",   mi=skid_mi)
    step_nd  = g.node("Side_Steps",        mi=step_mi)
    grill_nd = g.node("Grille_Trim",       mi=grill_mi)
    gls_nd   = g.node("Glass_Windows",     mi=gls_mi)
    int_nd   = g.node("Interior_Cockpit",  mi=int_mi)
    hdl_nd   = g.node("Lights_DRL_Amber",  mi=hdl_mi)
    tll_nd   = g.node("Lights_Taillights_Red", mi=tll_mi)

    wpos = {
        'Wheel_FL': [ TRACK_F/2,  WHEEL_RADIUS, FRONT_AXLE_Z],
        'Wheel_FR': [-TRACK_F/2,  WHEEL_RADIUS, FRONT_AXLE_Z],
        'Wheel_RL': [ TRACK_R/2,  WHEEL_RADIUS, REAR_AXLE_Z],
        'Wheel_RR': [-TRACK_R/2,  WHEEL_RADIUS, REAR_AXLE_Z],
    }
    w_nodes = []
    for wn, wp in wpos.items():
        tmi = g.mesh(tire_m,   m_tire,   f"{wn}_tire")
        omi = g.mesh(bead_o_m, m_beado,  f"{wn}_bead_o")
        imi = g.mesh(bead_i_m, m_beadi,  f"{wn}_bead_i")
        tn  = g.node(f"{wn}_tire",   mi=tmi)
        on  = g.node(f"{wn}_bead_o", mi=omi)
        inn = g.node(f"{wn}_bead_i", mi=imi)
        wg  = g.node(wn, ch=[tn,on,inn], t=wp)
        w_nodes.append(wg)

    root = g.node("Ranger_Raptor_Root",
                  ch=[cab_nd, bed_nd, sbar_nd, skid_nd, step_nd, grill_nd, gls_nd, int_nd, hdl_nd, tll_nd] + w_nodes)
    g.scenes[0]["nodes"] = [root]

    print("[5/6] Baking Turntable 360 animation...")
    g.anim(root, w_nodes, dur=10.0, fps=30)

    total_tris = (len(cab_mesh.faces) + len(bed_mesh.faces) + len(sports_bar.faces) +
                  len(skid_plate.faces) + len(side_steps.faces) + len(grille_trim.faces) +
                  len(glass.faces) + len(interior.faces) + len(hdl.faces) + len(tll.faces) +
                  4*(len(tire_m.faces)+len(bead_o_m.faces)+len(bead_i_m.faces)))
    print(f"  TOTAL TRIANGLES: {total_tris}")

    print("[6/6] Writing binary glTF (.glb)...")
    for p in OUT_PATHS:
        sz = g.export(p)
        print(f"  Wrote: {p} ({sz/1024/1024:.2f} MB)")

    print("="*70)
    print("  RAPTOR 4x4 GENERATION COMPLETED SUCCESSFULLY")
    print("="*70)

if __name__ == "__main__":
    main()
