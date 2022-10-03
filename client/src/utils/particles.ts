// color: String类型。默认’#dedede’。粒子颜色。

// particleOpacity: Number类型。默认0.7。粒子透明度。

// particlesNumber: Number类型。默认80。粒子数量。

// shapeType: String类型。默认’circle’。可用的粒子外观类型有：“circle”,“edge”,“triangle”, “polygon”,“star”。

// particleSize: Number类型。默认80。单个粒子大小。

// linesColor: String类型。默认’#dedede’。线条颜色。

// linesWidth: Number类型。默认1。线条宽度。

// lineLinked: 布尔类型。默认true。连接线是否可用。

// lineOpacity: Number类型。默认0.4。线条透明度。

// linesDistance: Number类型。默认150。线条距离。

// moveSpeed: Number类型。默认3。粒子运动速度。

// hoverEffect: 布尔类型。默认true。是否有hover特效。

// hoverMode: String类型。默认true。可用的hover模式有: “grab”, “repulse”, “bubble”。

// clickEffect: 布尔类型。默认true。是否有click特效。

// clickMode: String类型。默认true。可用的click模式有: “push”, “remove”, “repulse”, “bubble”。

export default {
    background: {
        color: {
            value: '#ffffff'
        }
    },
    fpsLimit: 120,
    interactivity: {
        events: {
            onClick: {
                enable: true,
                // push,remove,repulse,bubble
                mode: 'push'
            },
            onHover: {
                enable: true,
                // grad,repulse,bubble
                mode: 'repulse'
            },
            resize: true
        },
        modes: {
            bubble: {
                distance: 200,
                duration: 2,
                opacity: 0.8,
                size: 40
            },
            push: {
                quantity: 5
            },
            repulse: {
                distance: 100,
                duration: 0.4
            }
        }
    },
    particles: {
        color: {
            value: '#36AD6A'
        },
        links: {
            color: '#36AD6A',
            distance: 160,
            enable: true,
            opacity: 0.5,
            width: 1
        },
        collisions: {
            enable: true
        },
        move: {
            direction: 'none',
            enable: true,
            outMode: 'bounce',
            random: false,
            speed: 2,
            straight: false
        },
        number: {
            density: {
                enable: true,
                area: 800
            },
            value: 50
        },
        opacity: {
            value: 0.4
        },
        shape: {
            // edge,triangl
            type: 'circle'
        },
        size: {
            random: true,
            value: 5
        }
    },
    detectRetina: true
}