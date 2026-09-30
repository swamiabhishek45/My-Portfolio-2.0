"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Limb = { pivot: THREE.Group; phase: number; amplitude: number };

const material = (color: THREE.ColorRepresentation, roughness = 0.75) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.02 });

function limb(
  parent: THREE.Group,
  position: THREE.Vector3,
  length: number,
  radius: number,
  surface: THREE.Material,
  phase: number,
  amplitude: number,
  shoe?: THREE.Material,
) {
  const pivot = new THREE.Group();
  pivot.position.copy(position);
  parent.add(pivot);
  const segment = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length - radius * 2, 5, 10), surface);
  segment.position.y = -length / 2;
  segment.castShadow = true;
  pivot.add(segment);
  if (shoe) {
    const foot = new THREE.Mesh(new THREE.BoxGeometry(radius * 1.6, radius * 0.7, radius * 3), shoe);
    foot.position.set(0, -length - radius * 0.15, radius * 0.85);
    foot.castShadow = true;
    pivot.add(foot);
  }
  return { pivot, phase, amplitude };
}

/** Low-poly, walking version of the portfolio portrait. */
export function WalkingAvatar() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-4, 4, 2.35, -2.35, 0.1, 100);
    camera.position.set(0, 0.25, 11);
    camera.lookAt(0, 0.1, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x172033, 2.5));
    const key = new THREE.DirectionalLight(0xfff1df, 3.2);
    key.position.set(-4, 7, 8);
    key.castShadow = true;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8bb5ff, 1.5);
    rim.position.set(5, 3, -5);
    scene.add(rim);

    const avatar = new THREE.Group();
    // The face is modeled along +Z, which is also the direction of the camera.
    avatar.rotation.y = Math.PI / 2;
    avatar.scale.setScalar(1.12);
    scene.add(avatar);
    const skin = material(0xe5a072, 0.82);
    const shirt = material(0x15171c, 0.9);
    const denim = material(0x9bb8cf, 0.88);
    const white = material(0xf2f3f0, 0.62);
    const hair = material(0x14151a, 0.95);
    const facialHair = material(0x211b1b, 0.95);

    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.7, 7, 12), shirt);
    torso.scale.set(1.15, 1.05, 0.72);
    torso.position.y = 0.12;
    torso.castShadow = true;
    avatar.add(torso);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.14, 0.28, 10), skin);
    neck.position.y = 0.77;
    avatar.add(neck);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.37, 16, 14), skin);
    head.scale.set(0.9, 1.08, 0.88);
    head.position.set(0, 1.18, 0.02);
    head.castShadow = true;
    avatar.add(head);
    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.38, 14, 10, 0, Math.PI * 2, 0, Math.PI / 1.8), hair);
    hairCap.scale.set(0.98, 0.8, 0.93);
    hairCap.position.set(-0.01, 1.4, 0.02);
    avatar.add(hairCap);
    for (let i = 0; i < 6; i += 1) {
      const lock = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.42, 5), hair);
      lock.position.set(-0.28 + i * 0.11, 1.49 + Math.sin(i * 1.4) * 0.05, 0.2);
      lock.rotation.set(0.15, 0.2, -0.65 + i * 0.12);
      avatar.add(lock);
    }
    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), skin);
      ear.position.set(side * 0.33, 1.16, 0.01);
      ear.scale.set(0.65, 1, 0.55);
      avatar.add(ear);
    }
    const face = new THREE.Group();
    face.position.z = 0.325;
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.036, 8, 8), material(0x1b202a, 0.4));
      eye.position.set(side * 0.12, 1.23, 0.02);
      face.add(eye);
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.026, 0.025), facialHair);
      brow.position.set(side * 0.12, 1.32, 0.015);
      brow.rotation.z = side * -0.11;
      face.add(brow);
    }
    const beard = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), facialHair);
    beard.position.set(0, 0.98, 0.015);
    beard.scale.set(0.78, 0.32, 0.16);
    face.add(beard);
    avatar.add(face);

    const limbs: Limb[] = [
      limb(avatar, new THREE.Vector3(-0.47, 0.42, 0), 0.72, 0.12, skin, Math.PI, 0.58),
      limb(avatar, new THREE.Vector3(0.47, 0.42, 0), 0.72, 0.12, skin, 0, 0.58),
      limb(avatar, new THREE.Vector3(-0.2, -0.54, 0), 0.94, 0.15, denim, 0, 0.7, white),
      limb(avatar, new THREE.Vector3(0.2, -0.54, 0), 0.94, 0.15, denim, Math.PI, 0.7, white),
    ];
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 2.5),
      new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.22 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.62;
    ground.receiveShadow = true;
    scene.add(ground);

    const thoughtCanvas = document.createElement("canvas");
    thoughtCanvas.width = 560;
    thoughtCanvas.height = 360;
    const thoughtContext = thoughtCanvas.getContext("2d");
    if (thoughtContext) {
      thoughtContext.fillStyle = "#ffffff";
      thoughtContext.shadowColor = "rgba(15, 23, 42, 0.24)";
      thoughtContext.shadowBlur = 20;
      thoughtContext.shadowOffsetY = 8;
      const puffs = [
        [150, 180, 92],
        [220, 112, 86],
        [310, 104, 102],
        [400, 162, 90],
        [348, 232, 100],
        [230, 242, 94],
      ];
      puffs.forEach(([x, y, radius]) => {
        thoughtContext.beginPath();
        thoughtContext.arc(x, y, radius, 0, Math.PI * 2);
        thoughtContext.fill();
      });
      thoughtContext.shadowColor = "transparent";
      thoughtContext.fillStyle = "#1f2937";
      thoughtContext.font = "700 64px system-ui, sans-serif";
      thoughtContext.textAlign = "center";
      thoughtContext.textBaseline = "middle";
      thoughtContext.fillText("Hey hi!", 280, 178);
    }
    const thoughtTexture = new THREE.CanvasTexture(thoughtCanvas);
    thoughtTexture.colorSpace = THREE.SRGBColorSpace;
    const thoughtCloud = new THREE.Group();
    const thoughtBubble = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: thoughtTexture, transparent: true, depthWrite: false }),
    );
    thoughtBubble.scale.set(2.1, 1.35, 1);
    thoughtCloud.add(thoughtBubble);
    const thoughtDotMaterial = material(0xffffff, 0.6);
    const thoughtDotOne = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 10), thoughtDotMaterial);
    const thoughtDotTwo = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 10), thoughtDotMaterial);
    thoughtCloud.add(thoughtDotOne, thoughtDotTwo);
    thoughtCloud.visible = false;
    scene.add(thoughtCloud);

    const clock = new THREE.Clock();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let running = !reducedMotion.matches;
    let hovered = false;
    let walkingTime = 0;
    let thoughtCloudScale = 0;
    let pointerInHost = false;
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const setHovered = (nextHovered: boolean) => {
      if (hovered === nextHovered) return;
      hovered = nextHovered;
      host.style.cursor = hovered ? "pointer" : "";
    };
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      renderer.setSize(width, height, false);
      const viewHeight = 4.7;
      const aspect = width / Math.max(height, 1);
      camera.left = (-viewHeight * aspect) / 2;
      camera.right = (viewHeight * aspect) / 2;
      camera.top = viewHeight / 2;
      camera.bottom = -viewHeight / 2;
      camera.updateProjectionMatrix();
    };
    const updateHover = () => {
      if (!pointerInHost) return;
      scene.updateMatrixWorld();
      raycaster.setFromCamera(pointer, camera);
      setHovered(raycaster.intersectObject(avatar, true).length > 0);
    };
    const render = () => {
      const delta = clock.getDelta();
      if (!hovered) walkingTime += delta;
      const cycle = walkingTime * 4.6;
      // A sine wave makes the avatar walk to each side and naturally turn back,
      // instead of teleporting from one edge of the screen to the other.
      const patrolSpeed = 0.32;
      const travel = Math.sin(walkingTime * patrolSpeed);
      const movingRight = Math.cos(walkingTime * patrolSpeed) >= 0;
      const span = (camera.right - camera.left) / avatar.scale.x;
      avatar.position.x = travel * (span / 2 + 0.8);
      updateHover();
      avatar.position.y = hovered ? -0.38 : -0.38 + Math.abs(Math.sin(cycle)) * 0.026;
      avatar.rotation.x = THREE.MathUtils.damp(avatar.rotation.x, hovered ? 0.03 : Math.sin(cycle) * 0.035, 9, delta);
      avatar.rotation.z = THREE.MathUtils.damp(avatar.rotation.z, hovered ? 0.09 : Math.sin(cycle * 0.5) * 0.025, 9, delta);
      const walkDirection = movingRight ? Math.PI / 2 : -Math.PI / 2;
      const targetRotation = hovered ? 0 : walkDirection;
      avatar.rotation.y = THREE.MathUtils.damp(avatar.rotation.y, targetRotation, 9, delta);
      const thinkingPose = [
        { x: -0.18, z: 1.2 },
        { x: 0.16, z: -Math.PI + 0.18 },
        { x: 0.04, z: 0.02 },
        { x: -0.04, z: -0.02 },
      ];
      limbs.forEach(({ pivot, phase, amplitude }, index) => {
        const pose = thinkingPose[index];
        const targetX = hovered ? pose.x : Math.sin(cycle + phase) * amplitude;
        const targetZ = hovered ? pose.z : index > 1 ? Math.sin(cycle + phase) * 0.06 : 0;
        pivot.rotation.x = THREE.MathUtils.damp(pivot.rotation.x, targetX, 11, delta);
        pivot.rotation.z = THREE.MathUtils.damp(pivot.rotation.z, targetZ, 11, delta);
      });
      thoughtCloudScale = THREE.MathUtils.damp(thoughtCloudScale, hovered ? 1 : 0, 10, delta);
      thoughtCloud.visible = thoughtCloudScale > 0.01;
      if (thoughtCloud.visible) {
        thoughtCloud.position.set(avatar.position.x + 0.18, avatar.position.y + 1.88, 0.25);
        thoughtCloud.scale.setScalar(thoughtCloudScale);
        thoughtDotOne.position.set(-0.18, -0.65, 0);
        thoughtDotTwo.position.set(-0.34, -0.86, 0);
      }
      renderer.render(scene, camera);
      if (running) frame = requestAnimationFrame(render);
    };
    const onPointerMove = (event: PointerEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      pointer.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
      );
      pointerInHost = true;
      updateHover();
    };
    const onPointerLeave = () => {
      pointerInHost = false;
      setHovered(false);
    };
    const onMotionChange = () => {
      running = !reducedMotion.matches;
      if (running) render();
      else renderer.render(scene, camera);
    };
    const onVisibility = () => {
      if (document.hidden) running = false;
      else if (!reducedMotion.matches) {
        running = true;
        clock.start();
        render();
      }
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    reducedMotion.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibility);
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);
    render();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      reducedMotion.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const surfaces = Array.isArray(object.material) ? object.material : [object.material];
          surfaces.forEach((surface) => surface.dispose());
        }
      });
      thoughtTexture.dispose();
      thoughtBubble.material.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} aria-hidden="true" className="fixed inset-x-0 bottom-0 z-40 h-44 sm:h-52" />;
}
