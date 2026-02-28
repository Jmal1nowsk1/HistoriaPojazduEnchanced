const { chromium } = require('playwright')
const readline = require('readline')

function generateDates(year) {
    const businessDayDates = []
	const weekendDates = []
    let d = new Date(year, 0, 1)

    while (d.getFullYear() === year) {
        const day = String(d.getDate()).padStart(2, '0')
        const month = String(d.getMonth() + 1).padStart(2, '0')
		date = `${day}.${month}.${year}`
		if(d.getDay() < 1 || d.getDay() > 5){
			weekendDates.push(date)
		}
		else{
			businessDayDates.push(date)
		}
        d.setDate(d.getDate() + 1)
    }

    return businessDayDates.concat(weekendDates)
}

function type(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    return new Promise(resolve =>
        rl.question(question, answer => {
            rl.close()
            resolve(answer.trim())
        })
    )
}
async function checkOneDate(page,REG,VIN,date){
	await page.fill("#registrationNumber", REG)
	await page.fill("#VINNumber", VIN)
	await page.fill("#firstRegistrationDate", date)
	await page.click("button:has-text('Sprawdź pojazd')")
}

(async () => {

    const VIN = await type("Podaj VIN: ")
    const REG = await type("Podaj numer rejestracyjny: ")
	const YEAR = await type("Podaj rok rejestacji: ")

    const dates = generateDates(Number(YEAR))
    const total = dates.length
	
	const successURL = "https://moj.gov.pl/nforms/engine/ng/index?xFormsAppName=HistoriaPojazdu#/details"

    console.log(`\nStart sprawdzania roku ${YEAR} (${total} dat)\n`)

    const browser = await chromium.launch({ headless: true })
    let page = await browser.newPage()

    for (let i = 0; i < total; i++) {

        const date = dates[i]

        await page.goto("https://moj.gov.pl/nforms/engine/ng/index?xFormsAppName=HistoriaPojazdu#/search")
        await page.waitForSelector("#registrationNumber")
		checkOneDate(page,REG,VIN,date)
        await page.waitForTimeout(3000)
        const errorBtn = page.locator("button:has-text('SPRAWDŹ WPISANE DANE')")
		const currentURL = page.url()
        const progress = ((i + 1) / total * 100).toFixed(1)
		
		process.stdout.write(
            `\rSprawdzono: ${i + 1}/${total} (${progress}%) | Aktualna data: ${date}`
        )

        if (successURL === currentURL) {
            process.stdout.write(`\n\n ZNALEZIONO DATĘ: ${date}`)
			browser.close()
			const browserWindows = await chromium.launch({headless: false})
			page = await browserWindows.newPage()
			await page.goto("https://moj.gov.pl/nforms/engine/ng/index?xFormsAppName=HistoriaPojazdu#/search")
			await page.waitForSelector("#registrationNumber")
			checkOneDate(page,REG,VIN,date)
            return
        }

        await errorBtn.click()
    }

    console.log("\n\n Nie znaleziono poprawnej daty w tym roku.")
})()