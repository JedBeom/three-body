function sleep(t){
	return new Promise(resolve=>setTimeout(resolve,t));
}

let canvas = document.getElementById("tutorial")
let ctx = canvas.getContext("2d")

const newPlanet = (px, py, pvx, pvy, pm, pcolor) => (
	{x: px, y: py, vX: pvx, vY: pvy, aX: 0, aY: 0, mass: pm, color: pcolor}
) 

let planet1 = newPlanet(2500+200, 2500, 0, 10, 50, "blue")
let planet2 = newPlanet(2500, 2500, 0, 0, 1000, "red")
let planet3 = newPlanet(2500-400, 2500, 0, -11, 50, "green")

const planets = [planet1, planet2, planet3]
const next = [1, 2, 0, 1]

const distanceSquare = (p1, p2) => {
	return (p1.x-p2.x)**2 + (p1.y-p2.y)**2
}

const calGravityAccelration = (i) => {
	const G = 0.1
	planets[i].aX = 0
	planets[i].aY = 0

	for (let j=i; j<=i+1; j++) {
		planets[i].aX += G * planets[next[j]].mass * (planets[i].x - planets[next[j]].x) / distanceSquare(planets[i], planets[next[j]])
		planets[i].aY += G * planets[next[j]].mass * (planets[i].y - planets[next[j]].y) / distanceSquare(planets[i], planets[next[j]])
	}
}

const show = async = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	for (let i=0; i<planets.length; i++) {
		ctx.beginPath()
		ctx.arc(planets[i].x, planets[i].y, Math.log(planets[i].mass)*5, 0, Math.PI*2)
		ctx.fillStyle = planets[i].color
		ctx.fill()
	}
}

const draw = async () => {
	let count = 1;
	while (1) {
		if (isNaN(planets[0].x)) {
			console.error(`break on ${count}`)
			console.log({planets})
			break
		}

		show()

		for (let i=0; i<3; i++) {
			calGravityAccelration(i)
			planets[i].vX -= planets[i].aX
			planets[i].vY -= planets[i].aY
			planets[i].x += planets[i].vX
			planets[i].y += planets[i].vY
		}

		if (distanceSquare(planet1, planet2) < 30 || distanceSquare(planet2, planet3) < 30 || distanceSquare(planet3, planet1) < 30) break

		if (count%100==0) console.log({count, planets})

		count++
		await sleep(10)

	}
}


console.info("run")
draw()
