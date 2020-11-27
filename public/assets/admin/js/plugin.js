$(function () {
    if ($('.ckeditor').length) {
        CKEDITOR.replace('.ckeditor');
    }

    $('.delete_confirm').on('submit', function () {
        if (!confirm('Confirm deletion'))
            return false;
    });

    if ($("[data-fancybox]").length) {
        $("[data-fancybox]").fancybox();
    }
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $("#imagePreview").attr('src', e.target.result).width(100).height(100);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#image").change(function() {
    readURL(this);
});