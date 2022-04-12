import { createClient } from '@supabase/supabase-js'
import { imageOptimizer } from 'next/dist/server/image-optimizer'
import Image from 'next/image'
import { useState } from 'react'

// const val = Object.values(posts)
// {val.map((value: any) => (
//   <img
//     key={value.id}
//     src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${value.id}_0.jpg`}
//   />
// ))}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join('')
}

type Image = {
  id: number
  href: string
  imageSrc: string
  name: string
  username: string
}

export default function Gallery({ images }: { images: Image[] }) {
  return (
    <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {images.map((image) => (
          <BlurImage key={image.id} image={image} />
        ))}
      </div>
    </div>
  )
}

function BlurImage({ image }: { image: Image }) {
  const [isLoading, setLoading] = useState(true)

  return (
    <a href={image.href} className="group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
        <Image
          alt=""
          src={image.imageSrc}
          layout="fill"
          objectFit="cover"
          className={cn(
            'duration-700 ease-in-out group-hover:opacity-75',
            isLoading
              ? 'greyscale scale-110 blur-2xl'
              : 'greyscale-0 scale-100 blur-0'
          )}
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
      xD
      <h3 className="mt-4 text-sm text-gray-700">{image.name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">{image.username}</p>
    </a>
  )
}

export async function getStaticProps() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )

  // await supabaseAdmin.from('images').insert([
  //   {
  //     name: 'Pedro Duarte',
  //     href: 'https://twitter.com/peduarte/status/1463897468383412231',
  //     username: '@peduarte',
  //     imageSrc: 'https://pbs.twimg.com/media/FFDOtLkWYAsWjTM?format=jpg',
  //   },
  // ])

  const { data } = await supabaseAdmin.from('images').select('*').order('id')
  return {
    props: { images: data },
  }

  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch(
    'http://ddragon.leagueoflegends.com/cdn/12.6.1/data/en_US/champion.json'
  )
  const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts: posts.data,
    },
  }
}
