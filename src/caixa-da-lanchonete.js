import products from "./items.json"

class CaixaDaLanchonete {
	constructor(debitMultiplier = 1, creditMultiplier = 1.03, cashMultiplier = .95) {
		this.debitMultiplier = debitMultiplier
		this.creditMultiplier = creditMultiplier
		this.cashMultiplier = cashMultiplier
	}


	parseItems(items) {
		if (items.length < 1) {
			throw "Não há itens no carrinho de compra!"
		}
		let parsedItems = []
		for (let i = 0; i < items.length; i++) {
			let req = items[i].split(",")
			parsedItems.push(req)
		}

		return parsedItems
	}

	checkIfDependencyIsSatisfied(items, dependsOn) {
		for (let i = 0; i < items.length; i++) {
			if (items[i][0] === dependsOn) {
				return
			}
		}
		throw "Item extra não pode ser pedido sem o principal"
	}

	calculateItemsValue(items) {
		let total = 0

		for (let i = 0; i < items.length; i++) {
			let cod = items[i][0],
				quantity = Number.parseInt(items[i][1]);

			if (quantity < 1) {
				throw "Quantidade inválida!"
			}
			let product = products.products.find((i) => i.cod == cod)
			if (product === undefined) {
				throw "Item inválido!"
			}

			if (product.depends_on != undefined && this.checkIfDependencyIsSatisfied(items, product.depends_on));
			total += product.value * quantity
		}
		return total
	}

	calculateFinalValue(paymentMethod, value) {
		switch (paymentMethod) {
			case "dinheiro":
				return value * this.cashMultiplier
			case "credito":
				return value * this.creditMultiplier
			case "debito":
				return value * this.debitMultiplier
			default:
				throw "Forma de pagamento inválida!"
		}
	}

	formatToBrazilianReal(value) {
		// "fix" to a problem caused by value "36.565" was rounded to "36.57"
		return Number.parseFloat(Number.parseFloat(value).toFixed(2)).toLocaleString('pt-br', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 });

	}

	calcularValorDaCompra(metodoDePagamento, itens) {
		try {
			let items = this.parseItems(itens)
			let subtotal = this.calculateItemsValue(items)
			let total = this.calculateFinalValue(metodoDePagamento, subtotal)
			return this.formatToBrazilianReal(total)
		} catch (error) {
			console.log(error)
			return error
		}


	}

}

export { CaixaDaLanchonete };
