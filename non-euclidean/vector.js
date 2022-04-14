class Vec {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        if (z === undefined) this.z = 0;
        else this.z = z;
    }
    new() {
        return new Vec(this.x, this.y, this.z);
    }
    add(vec) {
        return new Vec(
            this.x + vec.x,
            this.y + vec.y,
            this.z + vec.z
        );
    }
    sub(vec) {
        return new Vec(
            this.x - vec.x,
            this.y - vec.y,
            this.z - vec.z
        );
    }
    mult(vec) {
        return new Vec(
            this.x * vec.x,
            this.y * vec.y,
            this.z * vec.z
        );
    }
    div(vec) {
        return new Vec(
            this.x / vec.x,
            this.y / vec.y,
            this.z / vec.z
        );
    }
    dot(vec) {
        return (
            this.x * vec.x +
            this.y * vec.y +
            this.z * vec.z);
    }
    cross(vec) {
        return new Vec(
            this.y * vec.z - this.z * vec.y,
            this.z * vec.x - this.x * vec.z,
            this.x * vec.y - this.y * vec.x,
        );
    }
    scale(s_fac) {
        return new Vec(this.x * s_fac, this.y * s_fac, this.z * s_fac);
    }
    len() {
        return sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    norm() {
        return this.scale(1 / this.len());
    }
    orbit_x(a) {
        return new Vec(
            this.dot(nvec(1, 0, 0)),
            this.dot(nvec(0, cos(a), -sin(a))),
            this.dot(nvec(0, sin(a), cos(a)))
        );
    }
    orbit_y(a) {
        return new Vec(
            this.dot(nvec(cos(a), 0, sin(a))),
            this.dot(nvec(0, 1, 0)),
            this.dot(nvec(-sin(a), 0, cos(a)))
        );
    }
    orbit_z(a) {
        return new Vec(
            this.dot(nvec(cos(a), -sin(a), 0)),
            this.dot(nvec(sin(a), cos(a), 0)),
            this.dot(nvec(0, 0, 1)),
        );
    }
}

function translate_vec(p) {
    translate(p.x, p.y);
}
function scale_vec(p) {
    scale(p.x, p.y);
}
function nvec(x, y, z) {
    return new Vec(x, y, z);
}

// Vector Math

// cartesian to polar

function norm_pol(pol_v) {
    return to_pol(to_cart(pol_v));
}

function to_pol(v) {
    return new Vec(atan2(v.y, v.x), acos(v.z));
}

// polar distance
function pol_dist(a, b) {
    return sqrt(2 - 2 * (sin(a.y) * sin(b.y) * cos(a.x - b.x) + cos(a.y) * cos(b.y)));
}

// polar to cartesian
function to_cart(v) {
    return new Vec(
        sin(v.y) * cos(v.x),
        sin(v.y) * sin(v.x),
        cos(v.y),
    );
}

function angle_btw(va, vb) {
    return acos(va.dot(vb) / (va.len() * vb.len()));
}

function orbit_vec(center, v, a) {
    let r = v.scale(cos(a)).add(center.cross(v).scale(sin(a))).add(center.scale(center.dot(v) * (1 - cos(a))));
    return r.norm();
}