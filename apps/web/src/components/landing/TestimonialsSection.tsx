// ABOUTME: Landing page testimonials section
// ABOUTME: Grid of user testimonial cards with ratings

import { Card, CardBody } from '@heroui/react'
import { Star } from 'lucide-react'
import { useTranslation } from '@/locales'

const TESTIMONIALS = [
  {
    key: 'sarah',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDAMl7dkEqVOHWmZiYC8bycrmCptq916UQVkjdBTQ01SyohQfiaTIwrl4_KAkbCBSbGIMpTJ9gZ7pCfRiZO-Vi441BD9tMryq4PLw79SQLLoy-vOeyj3PLJ9PiUbBGp4LqknN5v9x4ifK2HQIx2lUx92MjuNxqKHkpmyQdN7X00gAvi_1A-_Fq3dkM53HHI3c8VpT-jNYjN04BtgFveuToMVb2-cHXsfzu_-u7Go5_B02CoA0EjoT8JcwUQAYXaEBOOaE0pOIe0LS-6',
  },
  {
    key: 'alex',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAIzorp-bfkdIsIpSDgxwS8a-k1tf-Ytm4eDvEP8FZtJkSZ_RBnR2a4T-CWs3ejH9XieTcMtLFzAYoj2pj4cmeim27r5myjfHGp-m3NV2opVBZjaPPplobndKUFo6TxZ1gTVAdqMDk6U5LniXjEI3wf0EVDpXppfOhIK-41aiH_mRPo010VUJzjjY4QBenVBjcdZ2BiK90lFS_gK-6ivgldf7fGmWUYoGur3JufX5EsPxcQDOSjQjgNR5RsDmcx_hrhaxIapRnwdwb2',
  },
  {
    key: 'michael',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAmM9cJRudwxgSqqK4W6l-TeCQuTFYiieQGMk7v1YPPPyeCEWNthNMYVAMdjdS_rsITwyTGBNVtpNzJrIBeAwwEqciKWUphEcLYp-Z5sm-VJfO6_URs3-gLfqPVSf8PAVTKNoCSxwF-o7juO2Vsjwvq4uwV9FZ5_KAxLLqCch3Lj2PsRhOrbAkgzROq16f3HsCezCReDY7ZgyHMwFDfXNE_TVYi2xlKU2QQL1c1cwYL4vKcDhwsuSQVO_LFni4QB5qEkU76zwDNEZHi',
  },
] as const

function StarRating() {
  return (
    <div className="flex gap-1 text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={20} fill="currentColor" />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const { t } = useTranslation()

  return (
    <section className="bg-slate-50 py-20 dark:bg-[#111111]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-medium text-slate-900 md:text-4xl dark:text-white">
            {t('testimonials.title')}
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <Card
              key={testimonial.key}
              radius="lg"
              shadow="none"
              className="border border-slate-200 bg-white dark:border-white/5 dark:bg-surface-dark"
            >
              <CardBody className="flex flex-col gap-4 p-6">
                <StarRating />
                <p className="italic text-slate-700 dark:text-slate-300">
                  "{t(`testimonials.${testimonial.key}.quote`)}"
                </p>
                <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-white/5">
                  <div
                    className="h-10 w-10 rounded-full bg-gray-300 bg-cover bg-center"
                    style={{ backgroundImage: `url('${testimonial.avatar}')` }}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {t(`testimonials.${testimonial.key}.name`)}
                    </p>
                    <p className="text-xs text-slate-500">{t(`testimonials.${testimonial.key}.role`)}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
