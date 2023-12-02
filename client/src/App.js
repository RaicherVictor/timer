import { TextInput } from 'react-native'
import './App.css'
import _, { parseInt } from 'lodash'
import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Modal from 'react-modal'
import logo from './YrFuq4qoNdY.jpeg'

const DEF_TXT =
`										25\t2019-11-25	08:30:00 Normal	=> 00:00:00 - 10:05:58 = 10:05:58 
=> 12:02:12 - 13:05:54 = 01:03:42 
=> 15:38:20 - 16:26:21 = 00:48:01 
=> 10:06:58 - 11:52:37 = 01:45:39
=> 16:36:15 - 18:39:36 = 02:03:21 
=> 20:19:46 - 20:51:35 = 00:31:49 
=> 21:33:47 - 23:11:51 = 01:38:04`

function App () {
	let zer = DEF_TXT
	const [result, setResult] = useState('')
	const [state, setState] = useState(null)
	const callBackendAPI = async () => {
		const response = await fetch('/express_backend')
		const body = await response.json()

		if (response.status !== 200) {
			throw Error(body.message)
		}
		return body
	}
	useEffect(() => {
		callBackendAPI()
			.then(res => setState(res.express))
			.catch(err => console.log(err))
	}, [])

	const [modalIsOpen, setModalIsOpen] = useState(false)

	const openModal = () => {
		setModalIsOpen(true)
	}

	const closeModal = () => {
		setModalIsOpen(false)
	}

	return (
		<><Modal style={{ height: 100, width: 100 }} isOpen={modalIsOpen} onRequestClose={closeModal}>
			<div>
				<Nav>
					<Nav.Link href="http://localhost:5000/auth/vkontakte/callback"><button style={{ height: 100, width: 100 }}>Регистрация</button></Nav.Link>
				</Nav>
			</div>
		</Modal><header style={{
			height: 50, width: 1845, backgroundColor: '#0094FE'
		}}>
			<div>
				<img src={logo} style={{ height: 50, width: 50, float: 'left' }}/>
			</div>
			<button style={{ float: 'right', height: 50, width: 50 }} onClick={openModal}></button>
		</header>
		<Nav defaultActiveKey="/home" className="flex-sm-column" style={{ backgroundColor: '#87CEFA', float: 'left', width: 55, height: 925 }
		}>
			<Nav.Link href="/home"><button style={{ height: 50, width: 50, margin: 2 }}>home</button> </Nav.Link>

			<Nav.Link href="http://localhost:5000/auth/vkontakte"
				target="_blank"
				rel="noopener noreferrer"><button style={{ height: 50, width: 50, margin: 2 }}>Рег</button>
			</Nav.Link>

			<Nav.Link href="http://localhost:5000/auth/vkontakte/callback"><button style={{ height: 50, width: 50, margin: 2 }}>Логин</button> </Nav.Link>
		</Nav>
		<Container style={{ backgroundColor: '#B0E0E6', borderWidth: 2, width: 1845, height: 930 }}>
			<div className="App">
				<Container style={{ backgroundColor: 'white', height: 600, width: 600, borderStyle: 'solid', borderWidth: 2, margin: 5 }}>
					<TextInput
						multiline={true}
						numberOfLines={10}
						style={{ height: 500, width: 500, borderStyle: 'solid', borderWidth: 2, margin: 2 }}

						onChange={function (event) {
							zer = event.target.value
							console.log(zer)
						}
						}>
						{zer}
					</TextInput>
					<div id="totalTime" style={{ float: 'bottom' }}>TotalTime:{result.totalTime}</div>
					<div id="daysCount"style={{ float: 'bottom' }}>Count of days:{result.daysCount}</div>
					<div id="hours_norma"style={{ float: 'bottom' }}>Everyday Normal:{result.hours_norma}</div>
					<button onClick={function () {
						console.log(result)
						const strings = zer.split('\n')
						const times = []
						let sum = 0
						let days = 0
						_.each(strings, s => {
							let t
							if (s.split(' = ')[1]) {
								const tResult = s.split(' = ')[1]

								t = tResult.split(':')
								let t0 = parseInt(t[0])
								if (t0 < 0) t0 = t0 + 24

								t = parseInt(t[2]) + parseInt(t[1]) * 60 + t0 * 60 * 60
								sum += t
								times.push(t)
							}
							console.log(s.split(' ').toString(), '?')
							console.log(s.split(' ')[1], '?')
							if (s.split(/\t| /)[1]) {
								console.log('wowo')
								const date = new Date(Date.parse(s.split(/\t| /)[0]))
								const day = date.getDay()
								if (day !== 0 && day !== 6) {
									days = days + 1
								}
							}
						})
						const actualTime = new Date(sum * 1000)
						const actHour = (actualTime.getUTCHours() + (actualTime.getUTCDate() - 1) * 24).toString()
						const actMin = actualTime.getUTCMinutes().toString()
						const actSec = actualTime.getUTCSeconds().toString()
						console.log(days, 'dny')
						console.log(actualTime)
						console.log(actHour, 'часы')
						setResult({
							totalTime: (actHour + ':' + actMin + ':' + actSec),
							daysCount: days,
							hours_norma: days * 8.5
						})
					}} style={{ float: 'bottom' }}>Нажми меня!</button>
				</Container>
			</div>
		</Container>
		</>
	)
}

export default App
