import dotenv from 'dotenv'

dotenv.config()

import axios from 'axios'
import cheerio from 'cheerio'
import moment from 'moment'
import nodemailer from 'nodemailer'

async function enviarEmail(message: string, link: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.AUTH_MAIL,
      pass: process.env.AUTH_PASSWORD
    }
  })

  const mailOptions = {
    from: process.env.AUTH_MAIL,
    to: process.env.EMAIL_TO,
    subject: 'PS5 Disponivel (AMAZON)',
    text: `${message}\n PS5 disponivel, run barry!!!!\n ${link}`
  }

  return transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
      return
    }
    console.log('Email sent: ' + info.response)
  })
}

async function time(disponivel: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const dataHora = moment().format('DD/MM/YYYY HH:mm:ss')
      
      console.log(`${dataHora} --> ${disponivel}`)
      
      resolve(disponivel)
    }, 5_000);
  })
}

async function teste() {
  let disponivel: string = ''

  const link = process.env.LINK || ''

  if (!link) throw new Error('not found link')


  while (disponivel !== 'Em estoque.')  {
    const result = await axios.get(link)

    const $ = cheerio.load(result.data)

    const a = $('body').find('#availability').text().replace(/\r?\n|\r/g, '')

    disponivel = await time(a) as string
  }

  await enviarEmail(disponivel, link)
}

teste()