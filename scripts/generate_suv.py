#!/usr/bin/env python3
"""
================================================================================
TOYOTA RAV4 HYBRID AWD (SUV) - PROCEDURAL 3D GLB GENERATOR
Target: suv.glb (glTF 2.0 Binary, ~32k tris)
================================================================================
"""

import struct, json, math, sys, os
from pathlib import Path
import numpy as np
import trimesh

# ---- Outputs ----------------------------------------------------------------
OUT_PATHS = [
    Path(r"E:\Repositorio 2026\Trabajo Final de Programacion\frontend\public\models\suv.glb"),
    Path(r"E:\Repositorio 2026\Trabajo Final de Programacion\public\suv.glb"),
    Path(r"E:\Repositorio 2026\Trabajo Final de Programacion\frontend\public\suv.glb")
]
for p in OUT_PATHS:
    p.parent.mkdir(parents=True, exist_ok=True)

# ---- Dimensions (m) --------------------------------------------------------
LENGTH = 4.60;   WIDTH = 1.85;   HEIGHT = 1.68
WHEELBASE = 2.69; GROUND_CLEARANCE = 0.20
WHEEL_RADIUS = 0.36; TIRE_WIDTH = 0.235
TRACK_F = 1.60;  TRACK_R = 1.60
FRONT_AXLE_Z =  WHEELBASE / 2
REAR_AXLE_Z  = -WHEELBASE / 2
HALF_L = LENGTH / 2;  HW = WIDTH / 2

# ---- Colours (sRGB -> linear) ---------------------------------------------
def srgb_to_lin(h):
    h = h.lstrip('#')
    s = np.array([int(h[i:i+2],16)/255.0 for i in (0,2,4)])
    return list(np.where(s<=0.04045, s/12.92, ((s+0.055)/1.055)**2.4))

COL_BODY   = srgb_to_lin("#1B232B")  # River Styx metallic
COL_CLAD   = srgb_to_lin("#202428")  # Matte trim
COL_RAIL   = srgb_to_lin("#594C3D")  # Afternoon Tea bronze
COL_AMBER  = srgb_to_lin("#CA9C68")  # Amber Autumn DRL
COL_RED    = srgb_to_lin("#E02424")  # Ruby Red Taillights
COL_GLASS  = srgb_to_lin("#0B0F13")  # Dark tint
COL_RIM_O  = srgb_to_lin("#D5D8DC")  # Brushed silver
COL_RIM_I  = srgb_to_lin("#2B2F2E")  # Carbon inner
COL_TIRE   = srgb_to_lin("#121416")  # Rubber
COL_INT    = srgb_to_lin("#0A0C0E")  # Dark interior

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
#  SUV BODY GENERATION
# =============================================================================

def suv_cross_section(z, w_half, y_floor, y_belt, y_roof, w_roof_half, n_pts=64):
    pts = []
    seg = n_pts // 4
    # Bottom
    for i in range(seg):
        t = i / seg
        x = -w_half + 2*w_half*t
        pts.append([x, y_floor, z])
    # Right side (taller, more vertical SUV side)
    for i in range(seg):
        t = (i+1) / seg
        y = y_floor + (y_belt - y_floor)*t
        bulge = math.sin(t*math.pi)*0.02
        pts.append([w_half + bulge, y, z])
    # Right greenhouse (boxier SUV shoulder)
    seg_hi = seg // 2
    for i in range(seg_hi):
        t = (i+1) / seg_hi
        y = y_belt + (y_roof - y_belt)*t
        x = w_half - (w_half - w_roof_half)*t
        pts.append([x, y, z])
    # Roof (wide, flat with slight crown)
    for i in range(seg):
        t = (i+1) / seg
        x = w_roof_half - 2*w_roof_half*t
        crown = math.sin(t*math.pi)*0.018
        pts.append([x, y_roof + crown, z])
    # Left greenhouse
    for i in range(seg_hi):
        t = (i+1) / seg_hi
        y = y_roof - (y_roof - y_belt)*t
        x = -(w_roof_half + (w_half - w_roof_half)*t)
        pts.append([x, y, z])
    # Left side
    for i in range(seg - 1):
        t = (i+1) / seg
        y = y_belt - (y_belt - y_floor)*t
        bulge = math.sin((1-t)*math.pi)*0.02
        pts.append([-(w_half + bulge), y, z])
    return np.array(pts)

def generate_suv_body():
    GC = GROUND_CLEARANCE
    # Stations: taller, commanding SUV stance with vertical hatchback rear
    stations = [
        # Nose tip
        ( HALF_L,          HW*0.50, GC+0.25, GC+0.65, GC+0.65, HW*0.25),
        ( HALF_L-0.10,     HW*0.80, GC+0.12, GC+0.75, GC+0.75, HW*0.45),
        ( HALF_L-0.25,     HW*0.94, GC+0.05, GC+0.85, GC+0.85, HW*0.55),
        ( HALF_L-0.50,     HW*0.98, GC,      GC+0.92, GC+0.95, HW*0.60),
        # Front hood
        ( FRONT_AXLE_Z+0.20, HW*1.00, GC,    GC+0.94, GC+1.02, HW*0.62),
        ( FRONT_AXLE_Z-0.10, HW*1.00, GC,    GC+0.94, GC+1.20, HW*0.68),
        # Windshield base & A-Pillar
        ( FRONT_AXLE_Z-0.45, HW*1.00, GC,    GC+0.94, HEIGHT-0.03, HW*0.74),
        ( 0.40,             HW*1.00, GC,     GC+0.94, HEIGHT,      HW*0.76),
        # Mid-cabin & B/C Pillars
        ( 0.00,             HW*1.00, GC,     GC+0.94, HEIGHT,      HW*0.76),
        (-0.40,             HW*1.00, GC,     GC+0.94, HEIGHT,      HW*0.76),
        # Rear cargo & D-Pillar
        ( REAR_AXLE_Z+0.50, HW*1.00, GC,     GC+0.94, HEIGHT-0.01, HW*0.75),
        ( REAR_AXLE_Z+0.15, HW*1.00, GC,     GC+0.94, HEIGHT-0.03, HW*0.72),
        ( REAR_AXLE_Z-0.20, HW*0.98, GC,     GC+0.93, HEIGHT-0.08, HW*0.68),
        # Hatchback tailgate
        ( REAR_AXLE_Z-0.50, HW*0.95, GC+0.05,GC+0.90, HEIGHT-0.16, HW*0.62),
        (-HALF_L+0.30,     HW*0.90, GC+0.10,GC+0.82, GC+1.15,    HW*0.55),
        (-HALF_L+0.12,     HW*0.78, GC+0.18,GC+0.72, GC+0.80,    HW*0.40),
        (-HALF_L,          HW*0.50, GC+0.28,GC+0.62, GC+0.62,    HW*0.25)
    ]
    raw = [suv_cross_section(*s, n_pts=64) for s in stations]
    target_n = min(len(p) for p in raw)
    profiles = [p[np.linspace(0, len(p)-1, target_n, dtype=int)] for p in raw]
    return loft(profiles, close_caps=True)

def generate_suv_details():
    GC = GROUND_CLEARANCE
    parts = []
    # Front trapezoidal grille mesh
    parts.append(_box(WIDTH*0.62, 0.28, 0.06, 0, GC+0.48, HALF_L-0.06))
    parts.append(_box(WIDTH*0.48, 0.15, 0.08, 0, GC+0.22, HALF_L-0.08))
    # Side mirrors
    for s in [-1, 1]:
        parts.append(_box(0.12, 0.10, 0.18, s*(HW+0.11), GC+0.96, FRONT_AXLE_Z+0.05))
        parts.append(_box(0.06, 0.05, 0.09, s*(HW+0.04), GC+0.96, FRONT_AXLE_Z+0.10))
    # Door handles
    for s in [-1, 1]:
        for z in [FRONT_AXLE_Z-0.25, REAR_AXLE_Z+0.45]:
            parts.append(_box(0.025, 0.035, 0.14, s*(HW+0.01), GC+0.85, z))
    # Rear roof spoiler
    parts.append(_box(WIDTH*0.75, 0.04, 0.18, 0, HEIGHT+0.02, -HALF_L+0.35))
    # Dual rear exhausts
    parts.append(_box(0.08, 0.05, 0.08, -0.42, GC+0.18, -HALF_L+0.04))
    parts.append(_box(0.08, 0.05, 0.08,  0.42, GC+0.18, -HALF_L+0.04))
    return trimesh.util.concatenate(parts)

def generate_matte_claddings():
    """Polygonal wheel arch protective claddings and rugged rocker panels."""
    GC = GROUND_CLEARANCE
    parts = []
    # Lower rocker panels
    for s in [-1, 1]:
        parts.append(_box(0.05, 0.14, WHEELBASE*0.82, s*(HW+0.005), GC+0.07, 0))
    # 4 Wheel arch geometric flares
    for z in [FRONT_AXLE_Z, REAR_AXLE_Z]:
        for s in [-1, 1]:
            arch = _box(0.06, WHEEL_RADIUS*1.4, WHEEL_RADIUS*2.2, s*(HW+0.02), WHEEL_RADIUS*1.1, z)
            parts.append(arch)
    # Front lower skid protector
    parts.append(_box(WIDTH*0.50, 0.06, 0.12, 0, GC+0.08, HALF_L-0.12))
    # Rear lower bumper diffuser
    parts.append(_box(WIDTH*0.70, 0.10, 0.10, 0, GC+0.14, -HALF_L+0.08))
    return trimesh.util.concatenate(parts)

def generate_roof_rails():
    """Roof rails with crossbars."""
    parts = []
    rail_len = 1.95
    rail_z = -0.15
    for s in [-1, 1]:
        # Longitudinal bars
        bar = _cyl(0.022, rail_len, s*(HW*0.68), HEIGHT+0.035, rail_z, axis='z', sections=16)
        parts.append(bar)
        # Mounting stanchions (front, mid, rear)
        for z_st in [rail_z + 0.85, rail_z, rail_z - 0.85]:
            parts.append(_box(0.04, 0.05, 0.08, s*(HW*0.68), HEIGHT+0.015, z_st))
    # Two crossbars
    parts.append(_box(WIDTH*0.65, 0.02, 0.06, 0, HEIGHT+0.055, rail_z + 0.45))
    parts.append(_box(WIDTH*0.65, 0.02, 0.06, 0, HEIGHT+0.055, rail_z - 0.45))
    return trimesh.util.concatenate(parts)

def generate_suv_glass():
    GC = GROUND_CLEARANCE
    parts = []
    # Windshield
    parts.append(_box(WIDTH*0.72, 0.46, 0.03, 0, GC+1.26, FRONT_AXLE_Z-0.20))
    # Side windows
    for s in [-1, 1]:
        parts.append(_box(0.02, 0.36, 1.90, s*(HW*0.74), GC+1.22, -0.15))
    # Rear window
    parts.append(_box(WIDTH*0.66, 0.38, 0.03, 0, GC+1.18, -HALF_L+0.42))
    return trimesh.util.concatenate(parts)

def generate_suv_interior():
    GC = GROUND_CLEARANCE
    parts = []
    # High dashboard
    parts.append(_box(WIDTH*0.72, 0.22, 0.35, 0, GC+0.92, FRONT_AXLE_Z-0.30))
    # Center console screen
    parts.append(_box(0.18, 0.12, 0.04, 0, GC+1.08, FRONT_AXLE_Z-0.28))
    # Dual front seats
    for s in [-1, 1]:
        parts.append(_box(0.42, 0.48, 0.42, s*0.35, GC+0.62, 0.0))
        parts.append(_box(0.38, 0.50, 0.14, s*0.35, GC+0.92, -0.18))
    return trimesh.util.concatenate(parts)

def generate_suv_lights():
    GC = GROUND_CLEARANCE
    # Angular front headlights
    h_parts = []
    for s in [-1, 1]:
        h_parts.append(_box(0.26, 0.09, 0.06, s*0.52, GC+0.82, HALF_L-0.12))
    headlights = trimesh.util.concatenate(h_parts)

    # Horizontal rear taillights
    t_parts = []
    for s in [-1, 1]:
        t_parts.append(_box(0.28, 0.08, 0.05, s*0.50, GC+0.82, -HALF_L+0.12))
    # Center connecting bar
    t_parts.append(_box(0.40, 0.03, 0.04, 0, GC+0.83, -HALF_L+0.12))
    taillights = trimesh.util.concatenate(t_parts)

    return headlights, taillights

def generate_suv_wheel():
    R = WHEEL_RADIUS
    W = TIRE_WIDTH
    # Tire with knobby shoulder sipes
    tire = _cyl(R, W, 0, 0, 0, axis='x', sections=64)
    tv, tf = trimesh.remesh.subdivide(tire.vertices, tire.faces)
    tire = trimesh.Trimesh(vertices=tv, faces=tf, process=True)

    # 19" SUV alloy outer rim barrel
    rim_o = _cyl(R*0.74, W+0.008, 0, 0, 0, axis='x', sections=48)
    
    # 5 Sculpted alloy spokes
    spokes = []
    for i in range(5):
        ang = 2 * math.pi * i / 5
        spoke = _box(W+0.012, R*0.62, 0.05, 0, (R*0.35)*math.cos(ang), (R*0.35)*math.sin(ang))
        spokes.append(spoke)
    spokes_m = trimesh.util.concatenate(spokes)
    rim_o = trimesh.util.concatenate([rim_o, spokes_m])

    # Rim inner hub & brake rotor disc
    rim_i = _cyl(R*0.50, W+0.014, 0, 0, 0, axis='x', sections=32)
    return tire, rim_o, rim_i

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
        # Root turntable rotation Y 0 -> 360
        rr=np.zeros((nf,4),np.float32)
        for i,t in enumerate(ts):
            a=2*math.pi*t/dur
            rr[i]=[0,math.sin(a/2),0,math.cos(a/2)]
        # Suspension breathing Y
        rt=np.zeros((nf,3),np.float32)
        for i,t in enumerate(ts):
            rt[i]=[0, 0.015*math.sin(2*math.pi*t/dur), 0]
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
        j={"asset":{"version":"2.0","generator":"VEHX-SUV-RAV4-v1"},
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
    print("  TOYOTA RAV4 HYBRID AWD (SUV) - GLB GENERATOR")
    print("="*70)
    g = GLB()

    print("[1/6] Materials...")
    m_body = g.mat("CarPaint_RiverStyx",   COL_BODY+[1],   met=0.88, rough=0.24, cc=1.0, ccr=0.05)
    m_clad = g.mat("Trim_MatteCarbon",     COL_CLAD+[1],   met=0.10, rough=0.78)
    m_rail = g.mat("RoofRails_BronzeWood", COL_RAIL+[1],   met=0.85, rough=0.32)
    m_amb  = g.mat("Emissive_AmberAutumn", COL_AMBER+[1],  met=0.30, rough=0.30, emf=COL_AMBER, ems=3.0)
    m_red  = g.mat("Emissive_RubyRed",    COL_RED+[1],    met=0.30, rough=0.30, emf=COL_RED,   ems=2.2)
    m_gls  = g.mat("Glass_DarkTint",       COL_GLASS+[0.20],met=0.90,rough=0.06, trans=0.80, ds=True)
    m_rimo = g.mat("Alloy_DualTone_Outer", COL_RIM_O+[1],  met=0.95, rough=0.22)
    m_rimi = g.mat("Alloy_DualTone_Inner", COL_RIM_I+[1],  met=0.75, rough=0.45)
    m_tire = g.mat("Rubber_Tire",          COL_TIRE+[1],   met=0.00, rough=0.82)
    m_int  = g.mat("Interior_Dark",        COL_INT+[1],    met=0.10, rough=0.85)

    print("[2/6] Building SUV body & details...")
    body_base = generate_suv_body()
    details   = generate_suv_details()
    body_all  = trimesh.util.concatenate([body_base, details])
    bv, bf    = trimesh.remesh.subdivide(body_all.vertices, body_all.faces)
    body_all  = trimesh.Trimesh(vertices=bv, faces=bf, process=True)

    claddings = generate_matte_claddings()
    cv, cf = trimesh.remesh.subdivide(claddings.vertices, claddings.faces)
    claddings = trimesh.Trimesh(vertices=cv, faces=cf, process=True)

    rails     = generate_roof_rails()
    rv, rf = trimesh.remesh.subdivide(rails.vertices, rails.faces)
    rails = trimesh.Trimesh(vertices=rv, faces=rf, process=True)
    glass     = generate_suv_glass()
    interior  = generate_suv_interior()
    hdl, tll  = generate_suv_lights()

    print("[3/6] Generating Wheels...")
    tire_m, rim_o_m, rim_i_m = generate_suv_wheel()

    print("[4/6] Assembling scene graph...")
    body_mi = g.mesh(body_all, m_body, "Body_Chassis_mesh")
    clad_mi = g.mesh(claddings,m_clad, "Fenders_MatteTrim_mesh")
    rail_mi = g.mesh(rails,    m_rail, "Roof_Rails_mesh")
    gls_mi  = g.mesh(glass,    m_gls,  "Glass_Windows_mesh")
    int_mi  = g.mesh(interior, m_int,  "Interior_Cockpit_mesh")
    hdl_mi  = g.mesh(hdl,      m_amb,  "Lights_DRL_mesh")
    tll_mi  = g.mesh(tll,      m_red,  "Lights_Tail_mesh")

    body_nd = g.node("Body_Chassis",      mi=body_mi)
    clad_nd = g.node("Fenders_MatteTrim", mi=clad_mi)
    rail_nd = g.node("Roof_Rails",        mi=rail_mi)
    gls_nd  = g.node("Glass_Windows",     mi=gls_mi)
    int_nd  = g.node("Interior_Cockpit",  mi=int_mi)
    hdl_nd  = g.node("Lights_DRL_Amber",  mi=hdl_mi)
    tll_nd  = g.node("Lights_Taillights_Red", mi=tll_mi)

    wpos = {
        'Wheel_FL': [ TRACK_F/2,  WHEEL_RADIUS, FRONT_AXLE_Z],
        'Wheel_FR': [-TRACK_F/2,  WHEEL_RADIUS, FRONT_AXLE_Z],
        'Wheel_RL': [ TRACK_R/2,  WHEEL_RADIUS, REAR_AXLE_Z],
        'Wheel_RR': [-TRACK_R/2,  WHEEL_RADIUS, REAR_AXLE_Z],
    }
    w_nodes = []
    for wn, wp in wpos.items():
        tmi = g.mesh(tire_m,  m_tire, f"{wn}_tire")
        omi = g.mesh(rim_o_m, m_rimo, f"{wn}_rim_o")
        imi = g.mesh(rim_i_m, m_rimi, f"{wn}_rim_i")
        tn = g.node(f"{wn}_tire",  mi=tmi)
        on = g.node(f"{wn}_rim_o", mi=omi)
        inn= g.node(f"{wn}_rim_i", mi=imi)
        wg = g.node(wn, ch=[tn,on,inn], t=wp)
        w_nodes.append(wg)

    root = g.node("RAV4_SUV_Root",
                  ch=[body_nd, clad_nd, rail_nd, gls_nd, int_nd, hdl_nd, tll_nd] + w_nodes)
    g.scenes[0]["nodes"] = [root]

    print("[5/6] Baking Turntable 360 animation...")
    g.anim(root, w_nodes, dur=10.0, fps=30)

    total_tris = (len(body_all.faces) + len(claddings.faces) + len(rails.faces) +
                  len(glass.faces) + len(interior.faces) + len(hdl.faces) + len(tll.faces) +
                  4*(len(tire_m.faces)+len(rim_o_m.faces)+len(rim_i_m.faces)))
    print(f"  TOTAL TRIANGLES: {total_tris}")

    print("[6/6] Writing binary glTF (.glb)...")
    for p in OUT_PATHS:
        sz = g.export(p)
        print(f"  Wrote: {p} ({sz/1024/1024:.2f} MB)")

    print("="*70)
    print("  SUV GENERATION COMPLETED SUCCESSFULLY")
    print("="*70)

if __name__ == "__main__":
    main()
