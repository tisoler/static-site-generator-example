import Image from 'next/image'

type PokemonData = {
  data: {
    name: string,
    image: string,
    battles: {
      location_area: { name: string }
    }[]
  },
}

interface Params {
  id: number,
}

interface ParamsProps {
  params: Params
}

const fetcher = (url: string) => fetch(url, { next: { revalidate: 60 } }).then((res) => res.json())

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}

async function getPokemonData(params: Params): Promise<PokemonData> {
  // Traemos toda la informacion necesaria para renderizar una pagina web.
  const { name, location_area_encounters, sprites } = await fetcher(`https://pokeapi.co/api/v2/pokemon/${params.id}`)
  const pokemonBattles = await fetcher(location_area_encounters)

  return {
    data: {
      name,
      image: sprites.front_default,
      battles: pokemonBattles,
    },
  }
}

export default async function Page({ params }: ParamsProps) {
  const { data } = await getPokemonData(params)
  if (!data) return null

  return (
    <div className="container">
      <main className="main">
        <div className="card">
          <div className="cardImage">
            <Image src={data.image} alt="Pokemon" width={300} height={300} />
          </div>
          <div>
            <h2>{data.name}</h2>
            <h3>Battle Locations:</h3>
            <ul>
              {data.battles.map(({ location_area: { name } }) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
