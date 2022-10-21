

class Transform 
{
	constructor() {
		this.pos = vec3.create()
		this.angles = vec3.create()
		this.scale = vec3.fromValues(1,1,1)

		this.model_mat = mat4.identity(mat4.create())
	}

	set_pos(new_pos) {
		this.pos = new_pos
		this.update_model_matrix()
	}

	set_rotation(new_rots) {
		this.angles = new_rots
		this.update_model_matrix()
	}

	set_scale(new_scale) {
		this.scale = scale
		this.update_model_matrix()
	}

	get_model_mat() { return this.model_mat }

	update_model_matrix() {

		let S = mat4.fromScaling(mat4.create(), this.scale)
		// console.log("S", S)

		let Rx = mat4.fromRotation(mat4.create(), this.angles[0], vec3.fromValues(1, 0, 0))
		let Ry = mat4.fromRotation(mat4.create(), this.angles[1], vec3.fromValues(0, 1, 0))
		let Rz = mat4.fromRotation(mat4.create(), this.angles[2], vec3.fromValues(0, 0, 1))
		// console.log("R", Rx, Ry, Rz)

		let T = mat4.fromTranslation(mat4.create(), this.pos)
		// console.log("T", T, this.pos)

		// T * R * S
		let R = mat4.mul(Rz, Rx, mat4.mul(Ry, Ry, Rx))
		mat4.mul(this.model_mat, T, mat4.multiply(R, R, S))
		// console.log("model", this.model_mat)
	}
}