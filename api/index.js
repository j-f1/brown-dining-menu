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

module.exports = async (req, res) => {
  const $ = await fetch("https://dining.brown.edu/cafe/verney-woolley")
    .then((res) => res.text())
    .then(cheerio.load);
  res.status(200).json({
    lunch: map($("#lunch .site-panel__daypart-item"), parse),
    dinner: map($("#dinner .site-panel__daypart-item"), parse),
  });
};
