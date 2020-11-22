const cheerio = require("cheerio");
const fetch = require("node-fetch");

function map(selection, mapper) {
  return selection.toArray().map((el, i) => mapper(cheerio(el), i));
}

function parse(item) {
  return {
    name: item.find(".site-panel__daypart-item-title").text().trim(),
    desc: item.find(".site-panel__daypart-item-description").text().trim(),
    vegan:
      item.find(".site-panel__daypart-item-cor-icons [alt*=vegan i]").length >
      0,
    gf:
      item.find(
        ".site-panel__daypart-item-cor-icons [alt*='gluten-containing ingredients' i]"
      ).length > 0,
  };
}

const mealRe = /^Serving (\w+)/;

module.exports = async (req, res) => {
  const $ = await fetch("https://dining.brown.edu/cafe/sharpe-refectory")
    .then((res) => res.text())
    .then(cheerio.load);
  const [, currentMeal] = $(".site-panel__cafeinfo-currently")
    .text()
    .trim()
    .match(mealRe) || [, null];

  const meal = currentMeal || "Breakfast";

  res.status(200).json({
    meal: `Ratty ${currentMeal}`,
    open: currentMeal != null,
    menu: map($(`#${meal.toLowerCase()} .site-panel__daypart-item`), parse),
  });
};
