class Node {
	constructor(obj, name) {
		this.name = name
		this.obj = obj
		this.transform = new Transform()
		this.world_mat = mat4.identity(mat4.create())
		this.parent = null
		this.children = []
	}


	add_children(children) {
		this.children.push(children)
		children.parent = this
	}
}