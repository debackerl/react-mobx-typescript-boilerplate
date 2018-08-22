function encode(value: any): string {
	switch(typeof(value)) {
		case 'string':
			return encodeURIComponent(value);
		case 'number':
			return value;
		case 'boolean':
			return value ? '1' : '0';
	}
	return null;
}

export function makeRoute(baseUrl: string, route: string, parameters: { [key: string]: any }, optionals: { [key: string]: any } = null) {
	if(!parameters) parameters = {};

	let done = new Set<string>(), url = baseUrl + route.replace(/\/[:*]([\w_]+)/g, function(_, id) {
		done.add(id);
		let v = parameters[id];
		return '/' + encode(typeof(v) !== 'undefined' || !optionals ? v : optionals[id]);
	});
	
	let qp = [];
	for(let id in parameters) {
		let value = parameters[id];
		if(value && !done.has(id) && Object.prototype.hasOwnProperty.call(parameters, id)) {
			value = Array.isArray(value) ? value.map(encode).join(',') : encode(value);
			qp.push(encodeURIComponent(id) + '=' + encode(value));
		}
	}
	
	if(qp.length)
		url += '?' + qp.join('&');
	
	return url;
}

function parseBoolean(s: string): boolean {
	if(s === '1') return true;
	if(s === '0') return false;
	return null;
}

interface ParsedQuery {
  getString(id: string): string;
  getBoolean(id: string): boolean;
  getBooleanArray(id: string): Array<boolean>;
  getNumber(id: string): Number;
  getNumberArray(id: string): Array<Number>;
}

export function parseQuery(query: { [key: string]: string }): ParsedQuery {
	return {
		getString: function(id: string): string {
			let s = query[id];
			if(!s) return null;
			return decodeURIComponent(s);
		},
		getBoolean: function(id: string): boolean {
			return parseBoolean(query[id]);
		},
		getBooleanArray: function(id: string): Array<boolean> {
			let s = query[id];
			if(!s) return null;
			return s.split(',').map(i => parseBoolean(i));
		},
		getNumber: function(id: string): Number {
			let s = query[id];
			if(!s) return null;
			return Number.parseFloat(s);
		},
		getNumberArray: function(id: string): Array<Number> {
			let s = query[id];
			if(!s) return null;
			return s.split(',').map(i => Number.parseFloat(i));
		}
	};
}
