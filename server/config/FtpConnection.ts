import { Client } from 'basic-ftp'

export const ftpClient = new Client()

export const ftpServerInfo = {
  host: '192.168.2.8',
  user: 'ftp-user',
  password: 'interestrelar', // to decode
  port: 21,
}

export default ftpClient