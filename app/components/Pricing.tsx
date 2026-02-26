import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Per User Pricing",
    price: "$19.99",
    suffix: "/ month per active user",
    features: ["Pay only for active users", "No hidden fees", "Scale up or down as needed"],
  },
  {
    name: "Annual Licensing",
    price: "",
    suffix: "",
    features: ["1–25 Users → $1,500/year", "26–100 Users → $5,000/year", "101+ Users → $9,999/year"],
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              {plan.price && (
                <p className="text-4xl font-bold mb-6">
                  {plan.price}
                  <span className="text-lg font-normal text-gray-600">{plan.suffix}</span>
                </p>
              )}
              <ul className="mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center mb-2">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={index === 0 ? "default" : "outline"}>
                {index === 1 ? "Contact Sales" : "Get Started"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

