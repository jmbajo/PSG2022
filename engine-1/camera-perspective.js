class PerspectiveCamera {

    constructor() {
        
        this.fov = to_rad(45)   
        this.yaw = 0
        this.pitch = 0
        this.view_pos = vec3.fromValues(0, 0, 0)
        this.target = vec3.fromValues(0, 0, 0)
    
        this.update_matrices();
    }


    look_at(from, to) {
        let look_vector = vec3_normalize(vec3.create(), vec3.sub(vec3.create(), to, from))

        this.yaw = Math.atan2(look_vector[2], look_vector[0]) // -90
        this.pitch = Math.max( to_rad(-89.9), Math.min( Math.asin(look_vector[1]), to_rad(89.9)) );
        this.view_pos = from;

        //console.log( to_deg(this.yaw), to_deg(this.pitch), this.view_pos)

        this.update_matrices();
    } 

    look_direction() {
        
        let theta_rad = this.yaw;
        let phi_rad = this.pitch;
        let cos_phi = Math.cos(phi_rad);

        let x = cos_phi * Math.cos(theta_rad);
        let y = Math.sin(phi_rad);
        let z = cos_phi * Math.sin(theta_rad);

        return vec3.normalize(vec3.create(), vec3.fromValues(x, y, z));
    }

    set_pitch(pitch) {
        this.pitch = pitch
        this.update_matrices()
    }
    set_delta_pitch(delta) { this.set_pitch(this.pitch + delta); }

    set_yaw(yaw) {
        this.yaw = yaw
        this.update_matrices()
    }
    set_delta_yaw(delta) { this.set_yaw(this.yaw + delta); }

    translateU(units)
    {
        let dir = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), this.look_direction(), vec3.fromValues(0, 1, 0)));

        vec3.add(this.view_pos, this.view_pos, vec3.scale(vec3.create(), dir, units));
        this.update_matrices();
    }

    translateV(units)
    {
        let U = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), this.look_direction(), vec3.fromValues(0, 1, 0)));
        let dir = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), U, this.look_direction()));

        this.view_pos = vec3.add(vec3.create(), vec3.scale(vec3.create(), dir, units), this.view_pos);
        this.update_matrices();
    }

    translateW(units)
    {
        console.log(vec3.scale(vec3.create(), this.look_direction(), units))
        this.view_pos = vec3.add(vec3.create(), vec3.scale(vec3.create(), this.look_direction(), units), this.view_pos);
        this.update_matrices();
    }

    set_fov( new_fov ) {
        this.fov = Math.max(Math.min(new_fov, to_rad(90)), to_rad(5))
        this.update_matrices()
    }
    
    get_fov() {return this.fov;}

    // get_pos() {return this.pos;}

    // move(delta) {
    //     this.pos[0] += delta[0]
    //     this.pos[1] += delta[1]

    //     this.target[0] += delta[0]
    //     this.target[1] += delta[1]
    //     this.update_matrices();
    // }
    // set_pos(pos) {
    //     this.view_pos = pos;
    //     this.update_matrices();
    // }

    // set_target(target) {
    //     this.target = target;
    //     this.update_matrices();
    // }

    get_proj_mat() {
        return this.proj_mat;
    }

    get_view_mat() {
        return this.view_mat;
    }

    update_matrices() {
        this.proj_mat = mat4.perspective(mat4.create(), this.fov, 1.0, 0.1, 15)
        this.view_mat = mat4.lookAt(mat4.create(), this.view_pos, vec3.add(vec3.create(), this.view_pos, this.look_direction()), vec3.fromValues(0, 1, 0))
        // this.view_mat = mat4.lookAt(mat4.create(), this.view_pos, this.target, vec3.fromValues(0, 1, 0))
    }

}


















