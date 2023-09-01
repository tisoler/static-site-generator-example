'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Data {
  name?: string,
  image?: string,
  battles?: [{
    location_area: { name: string }
  }],
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ClientSide() {
  const [data, setData] = useState<Data>({})

  const getPokemon = async () => {
    const { name, location_area_encounters, sprites } = await fetcher('https://pokeapi.co/api/v2/pokemon/1')
    const pokemonBattles = await fetcher(location_area_encounters)
    setData({
      name,
      image: sprites.front_default,
      battles: pokemonBattles,
    })
  }

  useEffect(() => {
    // We call the API on the Frontend
    setTimeout(() => {
      getPokemon()
    }, 500);
  }, []);

  if (!data.name) return null

  return (
    <div className="container">
      <main className="main">
        <div className="card">
          <div className="cardImage">
            <Image src={data.image ?? ''} alt="Pokemon" width={300} height={300} layout="responsive" />
          </div>
          <div>
            <h2>{data.name}</h2>
            <h3>Battle Locations:</h3>
            <ul>
              {data.battles?.map(({ location_area: { name } }) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
