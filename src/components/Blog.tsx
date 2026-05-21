'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const posts = [
  {
    image: '/images/blog1.jpg',
    date: 'NOV 28, 2025',
    title: 'Turning Data into Strategy: The Power of Predictive Analytics',
    description:
      'Learn how predictive analytics can transform raw data into actionable strategies that drive smarter business decisions.',
    link: '/resources',
  },
  {
    image: '/images/blog2.jpg',
    date: 'NOV 28, 2025',
    title: '5 Ways AI Can Streamline Business Operations',
    description:
      'Discover practical applications of AI that can automate workflows, reduce costs, and accelerate your team\'s productivity.',
    link: '/resources',
  },
  {
    image: '/images/blog3.jpg',
    date: 'NOV 28, 2025',
    title: 'Human + Machine: Finding the Perfect Balance',
    description:
      'Explore how the synergy between human creativity and machine intelligence is reshaping the future of work.',
    link: '/resources',
  },
];

export default function Blog() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-[#7CFC00] text-sm font-semibold tracking-[0.15em] uppercase block mb-4"
          >
            INSIGHTS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4"
          >
            Latest insights and trends
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-[#666666] text-base sm:text-lg"
          >
            Whether you&apos;re optimizing today or building for tomorrow, we help
            you move faster with confidence.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              className="group"
            >
              <Link href={post.link}>
                <div className="rounded-2xl overflow-hidden mb-4 aspect-[4/3]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>
              <span className="text-[#7CFC00] text-xs font-semibold tracking-wider">
                {post.date}
              </span>
              <Link href={post.link}>
                <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] mt-2 mb-2 group-hover:text-[#1A2E1A] transition-colors">
                  {post.title}
                </h3>
              </Link>
              <p className="text-[#666666] text-sm sm:text-base leading-relaxed mb-3">
                {post.description}
              </p>
              <Link
                href={post.link}
                className="inline-flex items-center gap-1 text-[#1A2E1A] text-sm font-medium group-hover:gap-2 transition-all duration-300"
              >
                Read More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 bg-[#1A2E1A] text-white rounded-full px-8 py-3.5 text-sm sm:text-base font-medium hover:bg-[#243824] transition-colors duration-300 group shadow-lg shadow-[#1A2E1A]/10"
          >
            VIEW ALL RESOURCES
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
