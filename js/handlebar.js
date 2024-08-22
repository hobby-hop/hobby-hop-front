Handlebars.registerHelper('formatDate', function (date) {
  return customDateFormat(date);
});

Handlebars.registerHelper("isSameUser", function (writer, currentUser) {
  if (currentUser === writer) {
    return `<span class="comment-modify">수정</span><span class="comment-delete">삭제</span>`;
  }
});
Handlebars.registerHelper("isSameUser", function (writer, currentUser) {
  if (currentUser === writer) {
    return `<span class="comment-modify">수정</span><span class="comment-delete">삭제</span>`;
  }
});
Handlebars.registerHelper("calculateNum", function (total, page, size, index) {
  return total - ((page -1) * size) - index;
});

function makeTemplate(data, template) {
  let bindTemplate = Handlebars.compile(template);
  let resultHtml;
  if(!Array.isArray(data)) {
    resultHtml = bindTemplate(data);
  } else {
    resultHtml = data.reduce(function (prve, next) {
      return prve + bindTemplate(next);
    }, "");
  }
  
  return resultHtml;
}
