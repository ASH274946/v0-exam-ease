"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Star, Quote } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Priya Sharma",
    role: "B.Tech CSE, 3rd Year",
    college: "IIT Delhi",
    content:
      "ExamEase completely transformed my exam prep. The question bank generator saved me weeks of manual work. Scored 9.2 CGPA last semester!",
    rating: 5,
    initials: "PS",
  },
  {
    name: "Rahul Patel",
    role: "B.E. ECE, Final Year",
    college: "NIT Trichy",
    content:
      "The prep pack feature is incredible. It automatically identified the most important topics and frequently asked questions. Game changer!",
    rating: 5,
    initials: "RP",
  },
  {
    name: "Sneha Reddy",
    role: "B.Tech IT, 2nd Year",
    college: "BITS Pilani",
    content:
      "I love the focus mode and study planner. The spaced repetition actually works - I remember concepts much better now during exams.",
    rating: 5,
    initials: "SR",
  },
]

export function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="testimonials" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              students
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Join thousands of engineering students who have transformed their
            exam preparation with ExamEase.
          </p>
        </motion.div>

        <div ref={ref} className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="relative rounded-2xl border border-border bg-card p-6"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-muted/50" />
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-chart-3 text-chart-3"
                  />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {`"${testimonial.content}"`}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role} - {testimonial.college}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
