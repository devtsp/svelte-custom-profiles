import fs from 'fs';

const FRUITS_DB = 'db/fruits.json';

interface FruitBody {
	name: string;
	price?: number;
}

class FruitsRepository {
	private static instance: FruitsRepository | null = null;

	private constructor() {}

	public static getInstance(): FruitsRepository {
		if (FruitsRepository.instance === null) {
			FruitsRepository.instance = new FruitsRepository();
		}
		return FruitsRepository.instance;
	}

	getAll = () => {
		if (!this.fruitsBasketExists()) {
			this.createFruitsBasket();
		}
		return JSON.parse(fs.readFileSync(FRUITS_DB, 'utf8')) as FruitBody[];
	};

	getByName = (name: string) => {
		const found = this.getAll().find(
			fruit => fruit.name.toLowerCase() === name.toLocaleLowerCase()
		);
		if (!found) {
			return null;
		}
		return found;
	};

	add = (body: FruitBody) => {
		if (!body.name) {
			throw 'A fruit needs a name';
		}
		const exists = this.getByName(body.name);

		if (exists) {
			throw 'The basket can only contain one fruit type at the time!';
		}
		const fruitsBasket = this.getAll();
		const newFruit = { name: body.name, price: body.price || 0.0 };
		fruitsBasket.push(newFruit);
		fs.writeFileSync(FRUITS_DB, JSON.stringify(fruitsBasket, null, 4), 'utf8');
	};

	private createFruitsBasket = () => {
		try {
			fs.writeFileSync(FRUITS_DB, '[]', 'utf8');
		} catch (err) {
			throw 'Error creating fruits db';
		}
	};

	private fruitsBasketExists = () => {
		return fs.existsSync(FRUITS_DB);
	};
}

export default FruitsRepository.getInstance();
