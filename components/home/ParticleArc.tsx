"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/components/motion";
import { reducedMotion } from "@/components/ui";

/* The logo's sunrise arc, drawn in particles over the portfolio wall (client feedback, 2026-10-09: "the circle is
   just like the logo, top circle only line, and glowed, bursting particle"). The arc frames the wall the way the
   logo's arc frames E O S: it springs from the grid's top corners and rises over the heading. Like the logo it is
   thin at its left end and thick and round at its right end.

   Three kinds of point, one shader, all positions in CSS pixels (orthographic camera):
     line    ~55%  packed along the arc, spread across it by the arc's local thickness: the drawn line itself
     halo    ~15%  large, faint points spread wider: the glow around the line
     sparks  ~30%  thrown off the drawn line along its outward normal, fading as they go, then thrown again;
                   almost half of them leave from the leading tip, so the tip bursts as it draws and keeps
                   bursting from the round end once the arc is complete
   Scroll through the section drives it: the arc draws itself left to right (progress 0 to .45) and blows apart
   outward as it leaves (progress .78 to 1). Smoothed in the render loop.

   Colours from the palette only (Dawn, deep Dawn, pale Dawn), normal blending on the Mist ground. The canvas fills
   the section and fades out at its top and bottom edges (CSS mask), so particles never cross into the sections
   around it. Renders only while on screen; reduced motion gets one still frame of the finished arc; without WebGL
   nothing is drawn. three.js is loaded on demand. */

const VERTEX = /* glsl */ `
uniform float uTime, uDraw, uBlast, uPixel, uW, uR, uA0, uA1;
uniform vec2 uCenter;
uniform vec3 uDeep, uMid, uLight;
attribute float aU;
attribute float aKind;
attribute vec4 aRand;
varying vec3 vColor;
varying float vAlpha;

vec2 arcPos(float u, out vec2 n) { float th = mix(uA0, uA1, u); n = vec2(cos(th), -sin(th)); return uCenter + n * uR; }
float widthAt(float u) { return uW * (.06 + .94 * pow(u, 1.25)); }

void main() {
  float t = uTime;
  vec2 n; vec2 p; float alpha; float size; vec3 col;
  if (aKind < .5) {
    // The line: points across the stroke, revealed up to the drawing head.
    p = arcPos(aU, n);
    float w = widthAt(aU);
    p += n * aRand.x * w * .5;
    float vis = 1. - smoothstep(uDraw - .003, uDraw + .003, aU);
    alpha = vis * (.78 + .22 * sin(t * 2.3 + aU * 60. + aRand.y * 6.));
    size = 1.5 + aRand.z * 1.6 + w * .1;
    col = mix(uMid, uDeep, .3 * (1. - aU));
  } else if (aKind < 1.5) {
    // The glow: big faint points either side of the line.
    p = arcPos(aU, n);
    float w = widthAt(aU);
    p += n * aRand.x * (w * 1.8 + 16.);
    float vis = 1. - smoothstep(uDraw - .012, uDraw + .012, aU);
    alpha = vis * .11 * (.5 + .5 * aU);
    size = 12. + aRand.z * 18.;
    col = mix(uMid, uLight, .35);
  } else {
    // Sparks: thrown off the drawn arc, most of all from the head.
    float head = step(aRand.w, .45);
    float ue = mix(aRand.y * uDraw, max(0., uDraw - aRand.y * .03), head);
    p = arcPos(ue, n);
    vec2 tg = vec2(-n.y, n.x);
    float life = fract(t * (.22 + aRand.z * .5) + aRand.y * 13.7 + aRand.w * 5.1);
    float dist = mix(1., 1.8, head) * (24. + aRand.z * 150.) * (.35 + .65 * ue);
    p += n * life * dist + tg * life * dist * .35 * aRand.x;
    p += vec2(sin(t * 1.7 + aRand.y * 40.), cos(t * 1.3 + aRand.z * 30.)) * 5. * life;
    alpha = step(.002, uDraw) * pow(1. - life, 1.4) * mix(.65, 1., head);
    size = mix(2., 3.2, head) * (1. - life * .55) + aRand.z * 1.1;
    col = mix(uMid, uLight, smoothstep(.2, .9, life));
  }
  // Blast: everything flies outward and fades.
  float b = smoothstep(0., 1., clamp(uBlast * 1.4 - aRand.y * .4, 0., 1.));
  p += (n * (120. + aRand.z * 520.) + vec2(aRand.x, aRand.w - .5) * 260.) * b;
  alpha *= 1. - b;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p.x, -p.y, 0., 1.);
  gl_PointSize = size * uPixel;
  vColor = col;
  vAlpha = alpha;
}`;

const FRAGMENT = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - .5);
  if (d > .5) discard;
  gl_FragColor = vec4(vColor, smoothstep(.5, .08, d) * vAlpha);
}`;

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => v * (1 - t) + b[i] * t);
const DAWN = rgb("#EC790C"), INK = rgb("#272727"), WHITE = [1, 1, 1];
// Roughly normal in -1..1 (mean of three uniforms), so the line is dense in the middle and soft at its edges.
const gauss = () => ((Math.random() + Math.random() + Math.random()) / 1.5 - 1);

export function ParticleArc() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current; if (!el) return;
    const section = el.closest<HTMLElement>(".wall-section");
    const grid = section?.querySelector<HTMLElement>(".wall-grid");
    const heading = section?.querySelector<HTMLElement>(".wall-head");
    if (!section || !grid || !heading) return;
    let dead = false;
    let cleanup = () => {};

    void import("three").then((THREE) => {
      if (dead) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false }); } catch { return; }
      const still = reducedMotion();
      const small = window.matchMedia("(max-width: 760px)").matches;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      const LINE = small ? 5000 : 11000, HALO = small ? 1200 : 3000, SPARK = small ? 3000 : 7000;
      const COUNT = LINE + HALO + SPARK;
      const u = new Float32Array(COUNT), kind = new Float32Array(COUNT), rand = new Float32Array(COUNT * 4);
      for (let i = 0; i < COUNT; i++) {
        kind[i] = i < LINE ? 0 : i < LINE + HALO ? 1 : 2;
        u[i] = Math.random();
        rand.set([gauss(), Math.random(), Math.random(), Math.random()], i * 4);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
      geometry.setAttribute("aU", new THREE.BufferAttribute(u, 1));
      geometry.setAttribute("aKind", new THREE.BufferAttribute(kind, 1));
      geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));

      const uniforms = {
        uTime: { value: 0 }, uDraw: { value: still ? 1 : 0 }, uBlast: { value: 0 }, uPixel: { value: dpr },
        uW: { value: small ? 9 : 15 }, uR: { value: 1000 }, uA0: { value: 2 }, uA1: { value: 1 },
        uCenter: { value: new THREE.Vector2() },
        uDeep: { value: new THREE.Vector3(...mix(DAWN, INK, .3)) },
        uMid: { value: new THREE.Vector3(...DAWN) },
        uLight: { value: new THREE.Vector3(...mix(DAWN, WHITE, .55)) },
      };
      const material = new THREE.ShaderMaterial({ vertexShader: VERTEX, fragmentShader: FRAGMENT, uniforms, transparent: true, depthWrite: false });
      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      const scene = new THREE.Scene(); scene.add(points);
      const camera = new THREE.OrthographicCamera(0, 1, 0, -1, -10, 10);

      /* Geometry from the layout: the arc's ends sit just above the grid's top corners and its top sits above the
         heading, like the logo's arc over E O S. Chord c, rise s → radius R = (c²/4 + s²) / 2s. */
      const layout = () => {
        const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.right = w; camera.bottom = -h; camera.updateProjectionMatrix();
        const box = el.getBoundingClientRect(), g = grid.getBoundingClientRect(), hd = heading.getBoundingClientRect();
        const inset = small ? -6 : 0;
        const x0 = g.left - box.left + inset, x1 = g.right - box.left - inset;
        const yEnd = g.top - box.top - 18;
        const c = x1 - x0;
        const s = Math.min(Math.max(yEnd - (hd.top - box.top - (small ? 36 : 56)), 60), .42 * c);
        const R = (c * c / 4 + s * s) / (2 * s);
        const half = Math.asin(Math.min(1, c / 2 / R));
        uniforms.uR.value = R;
        uniforms.uCenter.value.set((x0 + x1) / 2, yEnd - s + R);
        uniforms.uA0.value = Math.PI / 2 + half;
        uniforms.uA1.value = Math.PI / 2 - half;
      };
      layout();
      const ro = new ResizeObserver(layout); ro.observe(el); ro.observe(grid);

      const target = { draw: still ? 1 : 0, blast: 0 };
      const st = still ? null : ScrollTrigger.create({
        trigger: section, start: "top 80%", end: "bottom 20%",
        onUpdate: (self) => {
          target.draw = Math.min(1, self.progress / .45);
          target.blast = Math.max(0, (self.progress - .78) / .22);
        },
      });

      const render = (time: number) => {
        uniforms.uTime.value = time / 1000;
        uniforms.uDraw.value += (target.draw - uniforms.uDraw.value) * .07;
        uniforms.uBlast.value += (target.blast - uniforms.uBlast.value) * .07;
        renderer.render(scene, camera);
      };
      let raf = 0;
      const loop = (time: number) => { render(time); raf = requestAnimationFrame(loop); };
      const io = new IntersectionObserver(([entry]) => {
        if (still) { if (entry.isIntersecting) { layout(); render(2600); } return; }
        if (entry.isIntersecting && !raf) raf = requestAnimationFrame(loop);
        if (!entry.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }
      });
      io.observe(el);

      cleanup = () => {
        io.disconnect(); ro.disconnect(); st?.kill(); cancelAnimationFrame(raf);
        geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove();
      };
    });

    return () => { dead = true; cleanup(); };
  }, []);

  return <div className="wall-gl" ref={host} aria-hidden="true" />;
}
