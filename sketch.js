const signals = {
	RED: { color: "red", signal: "STOP", state: "X" },
	YELLOW: { color: "yellow", signal: "SLOW DOWN", state: "T" },
	GREEN: { color: "green", signal: "GO", state: "O" },
};

const actions = {
	FAST: { speed: 4, action: "MOVING", state: "O" },
	SLOW: { speed: 2, action: "SLOWING DOWN", state: "T" },
	MOTIONLESS: { speed: 0, action: "STOPPED", state: "X" },
};

let currentLight;
let speed;
let vx, vy;
let tlx, tly;
let isParked;

let correct, incorrect, warning;
let lowerLimit, upperLimit;

function preload() {
	correct = loadImage("assets/correct.png");
	incorrect = loadImage("assets/incorrect.png");
	warning = loadImage("assets/warning.png");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	setInitials();
}

function draw() {
	background(220);

	drawRoad();
	drawTrafficLight();
	drawTrafficZone();
	drawCar();
	createResetButton();
	moveCar();

	if (vx >= windowWidth - 175) {
		speed = actions.MOTIONLESS.speed;
		isParked = true;
		noLoop();
	}

	signalsAndActions();
}

function setInitials() {
	currentLight = signals.GREEN.color;
	speed = 0;
	isParked = true;
	vx = 0;
	vy = 185;
	tlx = windowWidth / 2;
	tly = 10;

	let l = tlx - tlx / 3.5;
	let u = l + l / 6;

	lowerLimit = l + l / 3.5;
	upperLimit = u + (u - l) * 2;
}

function writeText(content, x, y, scaleFactor, hasBackground, isTitle) {
	push();
	let size = 10;
	strokeWeight(0.6);
	if (hasBackground) {
		push();
		fill("white");
		noStroke();
		rect(x - size * (scaleFactor / 2), y - 20, size * scaleFactor, 40);
		pop();
		if (isTitle) strokeWeight(1.7);
	}
	fill("black");
	textSize(24);
	textAlign(CENTER, CENTER);
	text(content, x, y);
	pop();
}

function signalsAndActions() {
	let start = windowHeight - 150;
	strokeWeight(2);
	stroke("black");
	line(0, start, windowWidth, start);
	line(windowWidth / 2, start, windowWidth / 2, windowHeight);
	writeText("SIGNAL", windowWidth / 4, start, 12, true, true);
	writeText("ACTION", windowWidth / 1.35, start, 12, true, true);

	let state = currentState();

	writeText(state[0].signal, windowWidth / 4, start + 75);
	writeText(state[1].action, windowWidth / 1.35, start + 75);

	let message = showState(state[0].state, state[1].state);

	if (message) writeText(message, windowWidth / 2, start - 70, 45, true);
}

function showState(signalState, actionState) {
	const x = windowWidth / 2 - 25,
		y = windowHeight - 100;
	const size = 50;
	let img;
	let message;
	let vxs = vx + 170;

	if (isParked) {
		message = "The car is parked.";
		img = correct;
	} else {
		if (signalState && actionState) {
			if (signalState == actionState) img = correct;
			else {
				message = "Signal and action states do not match.";
				img = incorrect;
			}

			if (vxs <= lowerLimit || vxs > upperLimit) {
				if (actionState == "X") {
					message = "Vehicle stopped outside signal zone.";
					img = incorrect;
				} else if (actionState == "T") {
					message = "Vehicle too slow outside signal zone.";
					img = warning;
				} else if (actionState == "O") {
					message = undefined;
					img = correct;
				}
			} else {
				if (actionState == "T" && signalState == "O") {
					message = "Vehicle too slow on Green Light.";
					img = warning;
				} else if (actionState == "O" && signalState == "T") {
					message = "Vehicle too fast on Yellow Light.";
					img = warning;
				}
			}
		} else {
			message = "Current State Unresolved.";
			img = warning;
		}
	}

	image(img, x, y, size, size);
	return message;
}

function currentState() {
	let signal, action;

	switch (currentLight) {
		case signals.RED.color:
			signal = signals.RED;
			break;
		case signals.YELLOW.color:
			signal = signals.YELLOW;
			break;
		case signals.GREEN.color:
			signal = signals.GREEN;
			break;
		default:
			print("Current State Unresolved.");
			break;
	}

	switch (speed) {
		case actions.FAST.speed:
			action = actions.FAST;
			break;
		case actions.SLOW.speed:
			action = actions.SLOW;
			break;
		case actions.MOTIONLESS.speed:
			action = actions.MOTIONLESS;
			break;
		default:
			print("Current State Unresolved.");
			break;
	}

	return [signal, action];
}

function drawRoad() {
	fill(100, 100, 100);
	rect(0, 232, windowWidth, 100);
}

function drawTrafficLight() {
	if (currentLight == signals.RED.color) {
		stroke(255);
		fill(0, 0, 0);
		rect(tlx, tly, 30, 70, 5);
		noStroke();
		fill(255, 0, 0);
		ellipse(tlx + 15, 25, 15, 15);
	} else if (currentLight == signals.YELLOW.color) {
		stroke(255);
		fill(0, 0, 0);
		rect(tlx, tly, 30, 70, 5);
		noStroke();
		fill(252, 236, 20);
		ellipse(tlx + 15, 45, 15, 15);
	} else if (currentLight == signals.GREEN.color) {
		stroke(255);
		fill(0, 0, 0);
		rect(tlx, tly, 30, 70, 5);
		fill(0, 255, 0);
		noStroke();
		ellipse(tlx + 15, 65, 15, 15);
	}
	noStroke();
	fill(100, 100, 100);
	rect(tlx + 10, 81, 10, 151);
}

function drawTrafficZone() {
	push();
	stroke("grey");
	strokeWeight(2);
	line(lowerLimit, 0, lowerLimit, 232);
	line(upperLimit, 0, upperLimit, 232);
	pop();
}

function drawCar() {
	let x = vx * 5,
		y = vy * 5;
	stroke("#5d646f");
	fill(168, 174, 183);
	beginShape();
	vertex((x + 152) / 5, (y + 289) / 5);
	vertex((x + 66) / 5, (y + 273) / 5);
	vertex((x + 59) / 5, (y + 254) / 5);
	vertex((x + 58) / 5, (y + 248) / 5);
	vertex((x + 57) / 5, (y + 223) / 5);
	vertex((x + 70) / 5, (y + 199) / 5);
	vertex((x + 66) / 5, (y + 164) / 5);
	vertex((x + 67) / 5, (y + 161) / 5);
	vertex((x + 69) / 5, (y + 153) / 5);
	vertex((x + 82) / 5, (y + 151) / 5);
	vertex((x + 95) / 5, (y + 150) / 5);
	vertex((x + 113) / 5, (y + 144) / 5);
	vertex((x + 140) / 5, (y + 142) / 5);
	vertex((x + 144) / 5, (y + 142) / 5);
	vertex((x + 182) / 5, (y + 123) / 5);
	vertex((x + 213) / 5, (y + 110) / 5);
	vertex((x + 248) / 5, (y + 99) / 5);
	vertex((x + 270) / 5, (y + 91) / 5);
	vertex((x + 271) / 5, (y + 85) / 5);
	vertex((x + 281) / 5, (y + 83) / 5);
	vertex((x + 290) / 5, (y + 85) / 5);
	vertex((x + 297) / 5, (y + 87) / 5);
	vertex((x + 314) / 5, (y + 87) / 5);
	vertex((x + 339) / 5, (y + 85) / 5);
	vertex((x + 365) / 5, (y + 82) / 5);
	vertex((x + 394) / 5, (y + 84) / 5);
	vertex((x + 424) / 5, (y + 86) / 5);
	vertex((x + 449) / 5, (y + 89) / 5);
	vertex((x + 475) / 5, (y + 90) / 5);
	vertex((x + 490) / 5, (y + 94) / 5);
	vertex((x + 510) / 5, (y + 103) / 5);
	vertex((x + 544) / 5, (y + 121) / 5);
	vertex((x + 570) / 5, (y + 133) / 5);
	vertex((x + 588) / 5, (y + 148) / 5);
	vertex((x + 604) / 5, (y + 157) / 5);
	vertex((x + 646) / 5, (y + 158) / 5);
	vertex((x + 702) / 5, (y + 165) / 5);
	vertex((x + 759) / 5, (y + 173) / 5);
	vertex((x + 784) / 5, (y + 180) / 5);
	vertex((x + 809) / 5, (y + 184) / 5);
	vertex((x + 834) / 5, (y + 201) / 5);
	vertex((x + 837) / 5, (y + 226) / 5);
	vertex((x + 845) / 5, (y + 238) / 5);
	vertex((x + 843) / 5, (y + 251) / 5);
	vertex((x + 844) / 5, (y + 255) / 5);
	vertex((x + 822) / 5, (y + 255) / 5);
	vertex((x + 812) / 5, (y + 277) / 5);
	vertex((x + 832) / 5, (y + 278) / 5);
	vertex((x + 836) / 5, (y + 274) / 5);
	vertex((x + 841) / 5, (y + 275) / 5);
	vertex((x + 838) / 5, (y + 286) / 5);
	vertex((x + 790) / 5, (y + 293) / 5);
	vertex((x + 788) / 5, (y + 280) / 5);
	vertex((x + 788) / 5, (y + 264) / 5);
	vertex((x + 783) / 5, (y + 242) / 5);
	vertex((x + 773) / 5, (y + 226) / 5);
	vertex((x + 757) / 5, (y + 216) / 5);
	vertex((x + 735) / 5, (y + 208) / 5);
	vertex((x + 712) / 5, (y + 210) / 5);
	vertex((x + 689) / 5, (y + 218) / 5);
	vertex((x + 673) / 5, (y + 229) / 5);
	vertex((x + 665) / 5, (y + 243) / 5);
	vertex((x + 665) / 5, (y + 243) / 5);
	vertex((x + 658) / 5, (y + 266) / 5);
	vertex((x + 656) / 5, (y + 284) / 5);
	vertex((x + 656) / 5, (y + 295) / 5);
	vertex((x + 287) / 5, (y + 296) / 5);
	vertex((x + 283) / 5, (y + 260) / 5);
	vertex((x + 278) / 5, (y + 238) / 5);
	vertex((x + 265) / 5, (y + 224) / 5);
	vertex((x + 243) / 5, (y + 212) / 5);
	vertex((x + 222) / 5, (y + 206) / 5);
	vertex((x + 194) / 5, (y + 214) / 5);
	vertex((x + 168) / 5, (y + 234) / 5);
	vertex((x + 157) / 5, (y + 249) / 5);
	vertex((x + 156) / 5, (y + 265) / 5);
	vertex((x + 152) / 5, (y + 287) / 5);
	endShape();
	fill(0);
	beginShape();
	vertex((x + 843) / 5, (y + 256) / 5);
	vertex((x + 837) / 5, (y + 274) / 5);
	vertex((x + 833) / 5, (y + 278) / 5);
	vertex((x + 812) / 5, (y + 276) / 5);
	vertex((x + 821) / 5, (y + 254) / 5);
	endShape();
	beginShape();
	vertex((x + 588) / 5, (y + 167) / 5);
	vertex((x + 241) / 5, (y + 153) / 5);
	vertex((x + 230) / 5, (y + 133) / 5);
	vertex((x + 230) / 5, (y + 128) / 5);
	vertex((x + 253) / 5, (y + 117) / 5);
	vertex((x + 284) / 5, (y + 108) / 5);
	vertex((x + 310) / 5, (y + 102) / 5);
	vertex((x + 355) / 5, (y + 97) / 5);
	vertex((x + 406) / 5, (y + 97) / 5);
	vertex((x + 451) / 5, (y + 102) / 5);
	vertex((x + 484) / 5, (y + 108) / 5);
	vertex((x + 582) / 5, (y + 165) / 5);
	endShape();
	fill(178, 207, 255);
	beginShape();
	vertex((x + 382) / 5, (y + 104) / 5);
	vertex((x + 391) / 5, (y + 156) / 5);
	vertex((x + 300) / 5, (y + 153) / 5);
	vertex((x + 292) / 5, (y + 108) / 5);
	vertex((x + 308) / 5, (y + 105) / 5);
	vertex((x + 321) / 5, (y + 102) / 5);
	vertex((x + 342) / 5, (y + 100) / 5);
	vertex((x + 357) / 5, (y + 99) / 5);
	endShape();
	beginShape();
	vertex((x + 285) / 5, (y + 111) / 5);
	vertex((x + 255) / 5, (y + 120) / 5);
	vertex((x + 235) / 5, (y + 130) / 5);
	vertex((x + 242) / 5, (y + 151) / 5);
	vertex((x + 294) / 5, (y + 152) / 5);
	endShape();
	beginShape();
	vertex((x + 395) / 5, (y + 104) / 5);
	vertex((x + 407) / 5, (y + 158) / 5);
	vertex((x + 530) / 5, (y + 162) / 5);
	vertex((x + 531) / 5, (y + 151) / 5);
	vertex((x + 536) / 5, (y + 145) / 5);
	vertex((x + 483) / 5, (y + 110) / 5);
	vertex((x + 396) / 5, (y + 100) / 5);
	endShape();
	fill(168, 174, 183);
	beginShape();
	vertex((x + 531) / 5, (y + 156) / 5);
	vertex((x + 560) / 5, (y + 156) / 5);
	vertex((x + 554) / 5, (y + 142) / 5);
	vertex((x + 536) / 5, (y + 145) / 5);
	endShape();
	fill(178, 207, 255);
	beginShape();
	vertex((x + 260) / 5, (y + 96) / 5);
	vertex((x + 259) / 5, (y + 109) / 5);
	vertex((x + 189) / 5, (y + 142) / 5);
	vertex((x + 150) / 5, (y + 140) / 5);
	vertex((x + 202) / 5, (y + 115) / 5);
	vertex((x + 230) / 5, (y + 106) / 5);
	vertex((x + 249) / 5, (y + 99) / 5);
	endShape();
	beginShape();
	vertex((x + 568) / 5, (y + 133) / 5);
	vertex((x + 604) / 5, (y + 159) / 5);
	vertex((x + 601) / 5, (y + 159) / 5);
	vertex((x + 590) / 5, (y + 159) / 5);
	vertex((x + 508) / 5, (y + 109) / 5);
	vertex((x + 507) / 5, (y + 101) / 5);
	endShape();
	fill(244, 248, 255);
	beginShape();
	vertex((x + 833) / 5, (y + 199) / 5);
	vertex((x + 831) / 5, (y + 206) / 5);
	vertex((x + 809) / 5, (y + 200) / 5);
	vertex((x + 780) / 5, (y + 199) / 5);
	vertex((x + 776) / 5, (y + 205) / 5);
	vertex((x + 795) / 5, (y + 217) / 5);
	vertex((x + 823) / 5, (y + 224) / 5);
	vertex((x + 829) / 5, (y + 228) / 5);
	vertex((x + 833) / 5, (y + 223) / 5);
	vertex((x + 836) / 5, (y + 222) / 5);
	endShape();
	fill(124, 0, 0);
	beginShape();
	vertex((x + 69) / 5, (y + 196) / 5);
	vertex((x + 86) / 5, (y + 193) / 5);
	vertex((x + 94) / 5, (y + 191) / 5);
	vertex((x + 100) / 5, (y + 188) / 5);
	vertex((x + 113) / 5, (y + 185) / 5);
	vertex((x + 117) / 5, (y + 183) / 5);
	vertex((x + 118) / 5, (y + 177) / 5);
	vertex((x + 118) / 5, (y + 176) / 5);
	vertex((x + 116) / 5, (y + 171) / 5);
	vertex((x + 111) / 5, (y + 171) / 5);
	vertex((x + 106) / 5, (y + 171) / 5);
	vertex((x + 101) / 5, (y + 171) / 5);
	vertex((x + 94) / 5, (y + 168) / 5);
	vertex((x + 88) / 5, (y + 167) / 5);
	vertex((x + 82) / 5, (y + 166) / 5);
	vertex((x + 76) / 5, (y + 166) / 5);
	vertex((x + 65) / 5, (y + 169) / 5);
	vertex((x + 66) / 5, (y + 177) / 5);
	vertex((x + 66) / 5, (y + 182) / 5);
	vertex((x + 66) / 5, (y + 187) / 5);
	vertex((x + 66) / 5, (y + 192) / 5);
	vertex((x + 69) / 5, (y + 196) / 5);
	endShape();
	fill(168, 174, 183);
	rect((x + 179) / 5, (y + 158) / 5, 8, 6, 2, 2);
	fill(40);
	ellipse((x + 221) / 5, (y + 265) / 5, 24, 24);
	fill(168, 174, 183);
	ellipse((x + 221) / 5, (y + 265) / 5, 15, 15);
	fill(40);
	ellipse((x + 723) / 5, (y + 265) / 5, 24, 24);
	fill(168, 174, 183);
	ellipse((x + 723) / 5, (y + 265) / 5, 15, 15);
	line((x + 242) / 5, (y + 154) / 5, (x + 307) / 5, (y + 271) / 5);
	line((x + 307) / 5, (y + 271) / 5, (x + 605) / 5, (y + 280) / 5);
	line((x + 396) / 5, (y + 159) / 5, (x + 404) / 5, (y + 273) / 5);
	line((x + 605) / 5, (y + 280) / 5, (x + 602) / 5, (y + 182) / 5);
	line((x + 602) / 5, (y + 182) / 5, (x + 587) / 5, (y + 167) / 5);
	rect((x + 270) / 5, (y + 171) / 5, 6, 2, 1, 1);
	rect((x + 420) / 5, (y + 171) / 5, 6, 2, 1, 1);
}

function moveCar() {
	vx = vx + speed;
}

function keyPressed() {
	if (keyCode === RIGHT_ARROW) {
		isParked = false;
		speed = actions.FAST.speed;
	} else if (keyCode === LEFT_ARROW) {
		isParked = false;
		speed = actions.SLOW.speed;
	} else if (keyCode === DOWN_ARROW) {
		speed = actions.MOTIONLESS.speed;
	}

	if (key == " ") {
		if (currentLight == signals.YELLOW.color) {
			currentLight = signals.RED.color;
		} else if (currentLight == signals.RED.color) {
			currentLight = signals.GREEN.color;
		} else if (currentLight == signals.GREEN.color) {
			currentLight = signals.YELLOW.color;
		}
	}

	if (key == "r") reset();
}

function doubleClicked() {
	reset();
}

function reset() {
	setInitials();
	redraw();
	loop();
}

function createResetButton() {
	let button = createButton("Reset");
	button.position(windowWidth - 150, 30);
	button.mousePressed(reset);
	button.size(120, 40);
}
