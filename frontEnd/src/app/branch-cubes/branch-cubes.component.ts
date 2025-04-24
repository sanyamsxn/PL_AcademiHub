// branch-cubes.component.ts
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { gsap } from 'gsap';

@Component({
  selector: 'app-branch-cubes',
  standalone:true,
  template: `
    <div #rendererContainer class="renderer-container"></div>
  `,
  styles: [`
    .renderer-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
  `]
})
export class BranchCubesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer') rendererContainer!: ElementRef;
  
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private boxes: THREE.Mesh[] = [];
  private animationFrameId!: number;
  
  // Branch names
  private branches = [
    "MCA", "MTech", "BTech-CS", "EEE", 
    "Chemical", "BCA", "BBA", "MBA"
  ];
  
  // Ground Y position
  private groundY = -1;
  
  // Materials with different colors
  private materialColors = [
    0xFFD43B,  // Yellow
    0x4285F4,  // Blue
    0xEA4335,  // Red
    0x34A853,  // Green
    0xFBBC05,  // Gold
    0x9C27B0,  // Purple
    0x00BCD4,  // Cyan
    0xFF9800    // Orange
  ];

  constructor() { }

  ngAfterViewInit(): void {
    this.initThree();
    this.initializeBoxes();
    this.animate();
    
    // Add window resize handler
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }
  
  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    this.renderer.dispose();
  }
  
  private initThree(): void {
    // Scene setup
    this.scene = new THREE.Scene();
    
    // Camera setup
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 14;
    this.camera.position.y = 5;
    
    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.setClearColor(0x121212, 1);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    
    // Add click event listener
    this.renderer.domElement.addEventListener('click', this.onClick.bind(this));
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 10, 7);
    this.scene.add(directionalLight);
    
    // Create invisible ground plane
    const groundGeometry = new THREE.PlaneGeometry(30, 30);
    const groundMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x121212,
      transparent: true,
      opacity: 0.0
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = this.groundY;
    this.scene.add(ground);
  }
  
  private createTextTexture(text: string, index: number): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height =512;
    const context = canvas.getContext('2d');
    
    // Fill with color matching the box
    const hexColor = '#' + this.materialColors[index % this.materialColors.length].toString(16).padStart(6, '0');
    
    // Create background gradient
    const gradient = context!.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, 'rgb(12, 11, 33)'); // Whitesmoke
    gradient.addColorStop(1, this.shadeColor('#000000',-30)); // darker shade
    
    context!.fillStyle = gradient;
    context!.fillRect(0, 0, 512, 512);
    
    // Add text shadow for better readability
    context!.shadowColor = 'rgba(0, 0, 0, 0.97)';
    context!.shadowBlur = 15;
    context!.shadowOffsetX = 4;
    context!.shadowOffsetY = 4;
    
    // Main text - large and bold
    context!.font = 'bold 110px Arial, Helvetica, sans-serif';
    context!.textAlign = 'center';
    context!.textBaseline = 'middle';
    
    // Text outline for better visibility
    context!.strokeStyle = '#ffffff';
    context!.lineWidth = 6;
    context!.strokeText(text, 256, 256);
    
    // Fill text
    context!.fillStyle = 'rgb(255, 255, 255)';
    context!.fillText(text, 256, 256);
    
    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    
    return texture;
  }
  // Add this method to your BranchCubesComponent

  // Helper function to darken color
  private shadeColor(color: string, percent: number): string {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);
    
    R = Math.max(0, Math.min(255, R + percent));
    G = Math.max(0, Math.min(255, G + percent));
    B = Math.max(0, Math.min(255, B + percent));
    
    const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
    const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
    const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));
    
    return "#" + RR + GG + BB;
  }
  
  private createBoxWithText(text: string, position: THREE.Vector3, index: number): THREE.Mesh {
    // Create cubic geometry (equal dimensions)
    const size = 2.5; // Larger cube size
    const geometry = new THREE.BoxGeometry(size, size, size);
    
    // Create textures for each face
    const frontTexture = this.createTextTexture(text, index);
    const uniformMaterial = new THREE.MeshStandardMaterial({ map: frontTexture });
    
    // Create materials array with text on front face
    const boxMaterials = [
      uniformMaterial, // right
    uniformMaterial, // left
    uniformMaterial, // top
    uniformMaterial, // bottom
    uniformMaterial, // front
    uniformMaterial 
    ];
    
    // Create mesh
    const box = new THREE.Mesh(geometry, boxMaterials);
    box.position.copy(position);
    
    // Add physics properties
    (box as any).userData = {
      velocity: {
        x: (Math.random() - 0.5) * 0.03,
        y: -0.02 - Math.random() * 0.02,
        z: (Math.random() - 0.5) * 0.03
      },
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
      },
      isSettled: false,
      branchName: text,
      bounceCount: 0,
      maxBounces: 3,
      bounceFactor: 0.6,
      bounceHeight: 0,
      originalY: 0,
      bounceTime: 2,
      textFace: 4 // The index of the face with text (front face)
    };
    
    this.scene.add(box);
    this.boxes.push(box);
    
    return box;
  }
  
  public initializeBoxes(): void {
    
    // Clear any existing boxes
    for (let i = this.boxes.length - 1; i >= 0; i--) {
      this.scene.remove(this.boxes[i]);
    }
    this.boxes.length = 0;
  
    const distance = 3.4; // Distance between each box along the x-axis
    const startX = -((this.branches.length - 1) * distance) / 2; // Center the boxes
  
    this.branches.forEach((branch, index) => {
      // Calculate position in a straight line pattern along the x-axis
      const x = startX + index * distance;
      const y = 10 + Math.random() * 3; // Random height offset
      const z = 0; // Keep all boxes at the same depth (z-axis)
  
      // Create the box with the text at the calculated position
      this.createBoxWithText(branch, new THREE.Vector3(x, y, z), index);
    });
  }
  // Handle window resize
  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  // Simulate bouncing
  private updateBoxes(): void {
    for (let i = 0; i < this.boxes.length; i++) {
      const box = this.boxes[i];
      const userData = (box as any).userData;
  
      if (userData.isSettled) {
        // Small idle bounce effect
        userData.bounceTime += 0.03;
        const bounceOffset = Math.sin(userData.bounceTime) * 0.05;
        box.position.y = userData.originalY + bounceOffset;
  
        // Add slight wobble for visual interest (no camera-facing rotation)
        box.rotation.x = Math.sin(userData.bounceTime * 0.7) * 0.02;
        box.rotation.z = Math.sin(userData.bounceTime * 0.5) * 0.02;
  
        continue;
      }
  
      // Apply motion
      box.position.x += userData.velocity.x;
      box.position.y += userData.velocity.y;
      box.position.z += userData.velocity.z;
  
      // Gravity
      userData.velocity.y -= 0.008;
  
      // Rotation
      box.rotation.x += userData.rotationSpeed.x;
      box.rotation.y += userData.rotationSpeed.y;
      box.rotation.z += userData.rotationSpeed.z;
  
      // Collision with ground
      const boxHeight = (box.geometry as THREE.BoxGeometry).parameters.height;
      if (box.position.y < this.groundY + (boxHeight / 2) && userData.velocity.y < 0) {
        
        if (userData.bounceCount === 0) {
          userData.originalY = this.groundY + (boxHeight / 2);
        }
        userData.bounceCount++;

        if (userData.bounceCount >= userData.maxBounces) {
          // Settle the box
          userData.isSettled = true;
          box.position.y = userData.originalY; 
          box.rotation.set(
            box.rotation.x * 0.2,
            box.rotation.y * 0.2,
            box.rotation.z * 0.2
          );
  
          userData.bounceTime = Math.random() * Math.PI;
        } else {
          // Bouncing
          const bounceFactor = userData.bounceFactor * (1 - userData.bounceCount * 0.15);
          userData.velocity.y = -userData.velocity.y * bounceFactor;
  
          box.position.y = this.groundY + (boxHeight / 2);
  
          userData.velocity.x = userData.velocity.x * 0.8 + (Math.random() - 0.5) * 0.03;
          userData.velocity.z = userData.velocity.z * 0.8 + (Math.random() - 0.5) * 0.03;
  
          if (userData.bounceCount < userData.maxBounces - 1) {
            userData.rotationSpeed = {
              x: (Math.random() - 0.5) * 0.02 * (1 - userData.bounceCount * 0.3),
              y: (Math.random() - 0.5) * 0.02 * (1 - userData.bounceCount * 0.3),
              z: (Math.random() - 0.5) * 0.02 * (1 - userData.bounceCount * 0.3)
            };
          } else {
            userData.rotationSpeed = {
              x: userData.rotationSpeed.x * 0.3,
              y: userData.rotationSpeed.y * 0.3,
              z: userData.rotationSpeed.z * 0.3
            };
          }
        }
      }
    }
  }
  
  // Click interaction
  private onClick(event: MouseEvent): void {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update the raycaster
    raycaster.setFromCamera(mouse, this.camera);
    
    // Calculate objects intersecting the ray
    const intersects = raycaster.intersectObjects(this.boxes);
    
    if (intersects.length > 0) {
      // Get the first intersected object
      const box = intersects[0].object as THREE.Mesh;
      const userData = (box as any).userData;
      
      // Make it jump if it's settled
      if (userData.isSettled) {
        userData.isSettled = false;
        userData.velocity.y = 0.25; // Higher jump
        userData.velocity.x = (Math.random() - 0.5) * 0.08;
        userData.velocity.z = (Math.random() - 0.5) * 0.08;
        
        userData.rotationSpeed = {
          x: (Math.random() - 0.5) * 0.04,
          y: (Math.random() - 0.5) * 0.04,
          z: (Math.random() - 0.5) * 0.04
        };
        
        userData.bounceCount = 0; // Reset bounce count
      }
    }
  }
  
  // Animation loop
  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    
    this.updateBoxes();
    this.renderer.render(this.scene, this.camera);
  }
  
  // Public method to be called from parent component when button is clicked
  public resetBoxes(): void {
    this.initializeBoxes();
  }
}