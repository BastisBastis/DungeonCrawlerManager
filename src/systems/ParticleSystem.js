import * as THREE from "three"
//Components
import { Position } from "../components/Position"
import { EventCenter } from "../helpers/EventCenter"

export const createParticleSystem = (world, maxParticles = 500) => {
    const particleSpeed=100
    const positions = new Float32Array(maxParticles * 3)
    const velocities = new Float32Array(maxParticles * 3)
    const lifetimes = new Float32Array(maxParticles)

    // Three geometry
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    )

    // Reference the actual array Three.js uses
    const positionsAttrArray = geometry.attributes.position.array

    // Three material
    const material = new THREE.PointsMaterial({
        color: 0x7799ff,
        size: 6,
        //sizeAttenuation: false,
        transparent: true,
        depthWrite: false
    })

    const particles = new THREE.Points( geometry, material )
    particles.frustumCulled = false
    world.scene.graphicsScene.add(particles)

    // --------------------------------
    // Spawn
    // --------------------------------
    const spawn = (position, count = 20) => {
        var spawned = 0
        //console.log("spawn", position, count)
        
        for (let i = 0; i < maxParticles; i++) {
            if (lifetimes[i] > 0) continue

            // FIX: Update positionsAttrArray instead of positions
            positionsAttrArray[i * 3]     = position.x
            positionsAttrArray[i * 3 + 1] = position.y
            positionsAttrArray[i * 3 + 2] = position.z
            

            velocities[i * 3]     = (Math.random() - 0.5) * particleSpeed
            velocities[i * 3 + 1] = Math.random() * particleSpeed
            velocities[i * 3 + 2] = (Math.random() - 0.5) * particleSpeed

            lifetimes[i] = 0.5 + Math.random() * 0.5

            spawned++
            if (spawned >= count) break
        }

        geometry.attributes.position.needsUpdate = true
    }

    EventCenter.on("spawnParticles", data=>{
        var position
        if (data.position) position = data.position
        else if (data.id) {
            position = {
                x: Position.x[data.id],
                y: 0,
                z: Position.y[data.id]
            }
        }
        spawn(position, data.count)
    })

    // --------------------------------
    // System
    // --------------------------------
    const system = (world, delta) => {
        const dt = delta/1000
        var particlesChanged = false

        for (let i = 0; i < maxParticles; i++) {
            if (lifetimes[i] <= 0) continue

            particlesChanged = true
            lifetimes[i] -= dt

            if (lifetimes[i] <= 0) {
                lifetimes[i] = 0
                // Optional: Move dead particles out of sight if needed, 
                // though setting life to 0 usually implies ignoring them.
                positionsAttrArray[i * 3] = -1000
                positionsAttrArray[i * 3 + 1] = 1000
            
                continue
            }

            // FIX: Update positionsAttrArray instead of positions
            positionsAttrArray[i * 3]     += velocities[i * 3] * dt
            positionsAttrArray[i * 3 + 1] += velocities[i * 3 + 1] * dt
            positionsAttrArray[i * 3 + 2] += velocities[i * 3 + 2] * dt

            // Gravity
            velocities[i * 3 + 1] -= 3 * dt
        }

        if (particlesChanged) {
            geometry.attributes.position.needsUpdate = true
        }

        return world
    }

    // Expose spawn so other systems can create effects
    system.spawn = spawn

    return system
}
