const assignmentDesign = {
  Intranet: {
    img: "images/intranet.svg",
    color: "#F5001E",
  },
  Quiz: {
    img: "images/quiz.svg",
    color: "#FCC636",
  },
  Resources: {
    img: "images/resources.svg",
    color: "#5324FD",
  },
  Attendance: {
    img: "images/attendance.svg",
    color: "#5324FD",
  },
  Regular: {
    img: "images/regular.svg",
    color: "#5324FD",
  },
};

$(function () {
  let selectedCategory = "all";

  $(".category-list button").on("click", function () {
    $(".category-list button").removeClass("active");
    $(this).addClass("active");
    selectedCategory = this.innerText;
    // $(this).css("background-color", assignmentDesign[selectedCategory].color);
  });

  const cardTemplate = $(".assignment-wrapper").first().clone();
  const $container = $(".assignment-wrapper").parent();
  $container.empty();

  $.getJSON("../canvas_assignments.json", function (assignment) {
    console.log(assignment);

    $.each(assignment, function (index, assignment) {
      let $newCard = cardTemplate.clone();
      let assignmentCategory = assignment.category;

      ($newCard
        .children(".single-assignment")
        .css("background-color", assignmentDesign[assignmentCategory].color),
        $newCard
          .find(".card-header img")
          .attr("src", assignmentDesign[assignmentCategory].img));
      $newCard.find(".titles h3").text(assignment.title);
      $newCard.find(".titles h3").attr("title", assignment.title);
      $newCard.find(".titles p").text("Wakuma");

      $newCard.find(".learn-more").attr("href", assignment.details);

      $newCard
        .find(".description")
        .text(
          "cost dollar paper mill health twice result interior leave plan planned hit lion college sang rather center mean oldest event beneath corn ten substancelorem",
        );

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
