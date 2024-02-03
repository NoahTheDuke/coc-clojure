(ns build-commands
  (:require
   [babashka.fs :as fs]
   [babashka.process :as p]
   [cheshire.core :refer [generate-string parse-string]]
   [clojure.set :as set]
   [clojure.string :as str]))

(def commands-json (-> (slurp "src/commands.json")
                       (parse-string true)
                       :commands
                       (->> (sort-by :command))))

(spit "src/commands.json" (generate-string {:commands commands-json}))
@(p/$ npx prettier --write --print-width 70 "src/commands.json")

(def aliases (->> commands-json
                  (filter :aliases)
                  (mapcat #(for [a (:aliases %)] (assoc % :command a)))))

(def commands-for-package
  (->> (concat commands-json aliases)
       (map #(-> (set/rename-keys % {:description :title})
                 (assoc :command (str "lsp-clojure-" (:command %)))
                 (select-keys [:command :title])))
       (sort-by :command)))

(println (str/join "\n" (map :command commands-for-package)))

(def temp (fs/delete-on-exit (fs/create-temp-file {:suffix ".json"})))

(spit (str temp) (generate-string {:commands commands-for-package}))

@(p/$ npx prettier --write --print-width 70 (str temp))

(println (slurp (str temp)))
