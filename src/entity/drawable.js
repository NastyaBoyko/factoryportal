class Drawable {
    constructor(type) {
        this._drawableType = type;
        this._parent = null;
        this._name = "";
    }

        destroy() {
            if (this._parent) {
                this._parent.remove(this);
            }
        }

        add(child) {}
        remove(child) {}

        getBoundingRect() { return null; }

        get drawableType() { return this._drawableType; }

        get parent() { return this._parent; }
        set parent(parent) { this._parent = parent; }

        get name() { return this._name; }
        set name(name) { this._name = name; }
}