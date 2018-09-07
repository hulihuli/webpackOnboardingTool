interface Array<T> {
    distinct(): this;
}

Array.prototype.distinct = function () {
    return this.filter((item: any, index: number) => index === this.lastIndexOf(item));
};
