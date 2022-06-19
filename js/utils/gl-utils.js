export class GlUtils {
    static rgbConverter = (...args) => args
        .map(hash => [
            parseInt(hash.slice(1,3), 16) / 255.0,
            parseInt(hash.slice(3,5), 16) / 255.0,
            parseInt(hash.slice(5,7), 16) / 255.0
        ])
        .reduce((acc, rgb) => [...acc, ...rgb]);
}