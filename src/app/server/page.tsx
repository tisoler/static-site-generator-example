import Image from 'next/image'
import './index.module.css'
import { headers } from 'next/headers'

type PokemonData = {
  data: {
    name: string,
    image: string,
    battles: {
      location_area: { name: string }
    }[]
  },
  ip: string,
}

const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then((res) => res.json())

async function getPokemonData(): Promise<PokemonData> {
  // Vamos a retrasar la respuesta del servidor 1 segundo para dramatizar los tiempos ya
  // que la aplicacion es muy pequeña.
  console.log("Start")
  console.time("Promise")
  await new Promise(done => setTimeout(() => done(1), 1000))
  console.log("End")
  console.timeEnd("Promise")

  // Traemos la data que vamos a necesitar, podemos utilizar los objetos req o query
  // para modificar el contenido segun la ruta o segun el usuario,
  const { name, location_area_encounters, sprites } = await fetcher('https://pokeapi.co/api/v2/pokemon/1')
  const pokemonBattles = await fetcher(location_area_encounters)

  const ip = headers().get('x-forwarded-for') || ''

  return {
    data: {
      name,
      image: sprites.front_default,
      battles: pokemonBattles,
    },
    ip,
  }
}

export default async function Page() {
  const { ip, data } = await getPokemonData()
  if (!data) return null

  return (
    <div className="container">
      Your ip: {ip}
      <main className="main">
        <div className="card">
          <div className="cardImage">
            <Image src={data.image} alt="Pokemon" width={300} height={300} layout="responsive" />
          </div>
          <div>
            <h2>{data.name}</h2>
            <h3>Battle Locations:</h3>
            <ul>
              {data.battles.map(({ location_area: { name } }) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
