export default function standardize(object: {[k: string]: any} = {}): any {
	/* 
		Desc:Iterates over the keys of an object to make the keys easier to reference e.g.
		Example: The key "1. symbol" would be turned into "symbol" 
	*/
	for (let key in object) {
		const newKey = key
            .replace(/[0-9]\./g, "")
            .trim()
            .replace(/ /g, "_");;
		object[newKey] = object[key];
		delete object[key]
	}
	return object;
}
