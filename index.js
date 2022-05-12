function sleep(t){
	return new Promise(resolve=>setTimeout(resolve,t));
}

let canvas = document.getElementById("tutorial")
let ctx = canvas.getContext("2d")

const newPlanet = (px, py, pw, pcolor) => (
	{x: px, y: py, vX: px, vY: py, oldvX: px, oldvY: py, weight: pw, color: pcolor}
) 

let planet1 = newPlanet(300, 350, 840, "blue")
let planet2 = newPlanet(700, 0, 100, "red")
let planet3 = newPlanet(950, 650, 2900, "green")

const planets = [planet1, planet2, planet3, planet1, planet2, planet3]

const distanceBetween = (p1, p2) => {
	return Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2)
}

const gravityScala = (p1, p2) => {
	const G = 100
	return (G*p1.weight*p2.weight)/(distanceBetween(p1, p2)**2)
}

const show = async = () => {
	for (let i=0; i<planets.length; i++) {
		planets[i].x = planets[i].vX
		planets[i].y = planets[i].vY

		ctx.beginPath()
		ctx.arc(planets[i].x, planets[i].y, Math.log(planets[i].weight)*5, 0, Math.PI*2)
		ctx.fillStyle = planets[i].color
		ctx.fill()
	}
}

const draw = async () => {
	show()
	while (1) {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		for (let i=0; i<3; i++) {
			let poses = []
			for (let j=1; j<3; j++) {
				const g = gravityScala(planets[i], planets[i+j]) / planets[i].weight
				const ratio = g/distanceBetween(planets[i], planets[i+j])
				let pX = planets[i+j].x - planets[i].x
				let pY = planets[i+j].y - planets[i].y
				
				poses.push([pX*ratio, pY*ratio])
			}

			// oldvX, oldvY에 planets[i].x, y가 포함되어 있음
			planets[i].vX = poses[0][0] + poses[1][0] + planets[i].oldvX
			planets[i].vY = poses[0][1] + poses[1][1] + planets[i].oldvY

			planets[i].oldvX = (poses[0][0] + poses[1][0])*10 + planets[i].x
			planets[i].oldvY = (poses[0][1] + poses[1][1])*10 + planets[i].y


		}

		show()

		if (distanceBetween(planet1, planet2) < 30 || distanceBetween(planet2, planet3) < 30 || distanceBetween(planet3, planet1) < 30) break

		await sleep(10)

	}
}



draw()