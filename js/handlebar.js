Handlebars.registerHelper('formatDate', function(date, format) {
  return customDateFormat(date, format);
});

function makeTemplate(data, template) {
  let bindTemplate = Handlebars.compile(template);

  let resultHtml = data.reduce(function (prve, next) {
    return prve + bindTemplate(next);
  }, "");
  return resultHtml;
}
