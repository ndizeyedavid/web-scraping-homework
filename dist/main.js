const assignmentImages = {
  Intranet: "images/intranet.svg",
  Quiz: "images/quiz.svg",
  Resources: "images/resources.svg",
  Attendance: "images/attendance.svg",
  Regular: "images/regular.svg",
};

$(function () {
  let selectedCategory = "all";

  $(".category-list button").on("click", function () {
    $(".category-list button").removeClass("active");
    $(this).addClass("active");
    selectedCategory = this.innerText;
  });

  const cardTemplate = $(".assignment-wrapper").first().clone();
  const $container = $(".assignment-wrapper").parent();
  $container.empty();

  $.getJSON("../canvas_assignments.json", function (assignment) {
    console.log(assignment);

    $.each(assignment, function (index, assignment) {
      let $newCard = cardTemplate.clone();

      $newCard
        .find(".card-header img")
        .attr("src", assignmentImages[assignment.category]);
      $newCard.find(".titles h3").text(assignment.title);
      $newCard.find(".titles h3").attr("title", assignment.title);
      $newCard.find(".titles p").text("Wakuma");

      $newCard.find(".description").text("lorem");

      let $pillList = $newCard.find(".pill-list");
      $pillList.empty();

      let $pill_1 = $("<span>").addClass("pill").text(assignment.status);
      let $pill_2 = $("<span>").addClass("pill").text(assignment.category);
      $pillList.append($pill_1, $pill_2);

      $newCard.find(".due-date").text(assignment.dueDate);
      $newCard.find(".marks").text(assignment.score);

      $container.append($newCard);
    });
  }).fail(function (error) {
    console.error("Failed to load the scrapped assignments. ERROR", error);
  });
});
