import { Client } from 'basic-ftp'

export const ftpClient = new Client()

export const ftpServerInfo = {
  host: '192.168.2.11',
  user: 'ftp-user',
  password: 'aW50ZXJlc3RyZWxhcg==', // to decode
  port: 21,
}

export default ftpClient