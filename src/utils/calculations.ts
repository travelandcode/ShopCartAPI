export class Calculations{
    generateId() {
        return Number(Math.floor(Math.random()* (999 - 100 + 1) + 100)+''+Date.now())
    }

    generateFormattedDate() {
        const currentDate = new Date()
        const options:Intl.DateTimeFormatOptions =  {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }
        const formattedDate = currentDate.toLocaleString('en-US',options)
        return formattedDate
    }

    generateRandomLetters(){
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let randomLetters = ''
        for(let i = 0; i < 3; i++){
            const randomIndex = Math.floor(Math.random() * alphabet.length)
            randomLetters += alphabet[randomIndex]
        }
        return randomLetters
    }

    generateToken(){
        const date = Date.now()
        const randomLetters  = this.generateRandomLetters()
        const token = randomLetters+""+date
        return token
    }

    generateEstimatedDeliveryDate(){
        
    }
}

