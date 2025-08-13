"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { communities } from "@/components/fake-backends/communities";
import { SpotCard } from "@/components/SpotCard/spotcard";

const Hubs = () => {
  const [query, setQuery] = useState("");
  const { t } = useTranslation("hubs");

  const handleSearch = () => {
    console.log("Qidirilyapti:", query);
  };

  return (
    <section>
      <div className="container mx-auto px-2">
        <div className="min-h-[60vh] flex items-center justify-center relative py-8">
          <div className="absolute blur-[100px] w-[80vw] max-w-[500px] h-[100px] bg-primary rounded-full shadow-[0px_0px_100px] shadow-primary"></div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="z-10 w-full max-w-lg flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-2"
          >
            <Input
              placeholder={t("search_placeholder")}
              className="h-12 w-full text-base"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              onClick={handleSearch}
              size="lg"
              className="h-12 w-full sm:w-auto bg-primary hover:scale-105 cursor-pointer"
            >
              <Search className="w-4 h-4 mr-2" />
              {t("search_button")}
            </Button>
          </form>
        </div>

        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-16">
          {communities.map((community, i) => (
            <SpotCard
              key={i}
              community={{
                icon: community.icon,
                title: community.title,
                members: community.members,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hubs;
