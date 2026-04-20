
$(document).ready(function() {
    let selectedMeals = [];

    $('.btn-details').click(function() {
        let row = $(this).closest('tr');
        let name = row.data('name');
        let details = row.data('details');
        let price = Number(row.data('price')).toLocaleString();

        Swal.fire({
            title: '<strong>' + name + '</strong>',
            html: details + '<br><br><b style="color:#0e4f1f">السعر: ' + price + ' ل.س</b>',
            icon: 'info',
            confirmButtonText: 'إغلاق',
            confirmButtonColor: '#0e4f1f'
        });
    });

    $('.btn-add').click(function() {
        let row = $(this).closest('tr');
        let id = row.data('id');
        let name = row.data('name');
        let price = Number(row.data('price'));

        selectedMeals.push({ id: id, name: name, price: price });
        
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
        });
        Toast.fire({
            icon: 'success',
            title: 'تم اختيار: ' + name
        });
    });

    $('#bookingForm').submit(function(e) {
        e.preventDefault(); 

        let name = $('#name').val().trim();
        let account = $('#account').val().trim();
        let dob = $('#dob').val();
        let phone = $('#phone').val().trim();


        let nameRegex = /^[a-zA-Z\s]+$/;
        if (name === "" || !nameRegex.test(name)) {
            Swal.fire({
                icon: 'error',
                title: 'خطأ في الاسم',
                text: 'يرجى إدخال الاسم باللغة الإنجليزية فقط (أحرف ومسافات).',
                confirmButtonColor: '#d33'
            });
            return;
        }

        let accountRegex = /^0\d{5}$/;
        if (!accountRegex.test(account)) {
            Swal.fire({
                icon: 'error',
                title: 'رقم الحساب غير صحيح',
                text: 'يجب أن يتكون رقم الحساب من 6 خانات ويبدأ بالصفر (مثال: 055555).',
                confirmButtonColor: '#d33'
            });
            return;
        }

        if (dob === "") {
            Swal.fire({
                icon: 'warning',
                title: 'تاريخ الميلاد',
                text: 'يرجى اختيار تاريخ الميلاد.',
                confirmButtonColor: '#f39c12'
            });
            return;
        }

        let phoneRegex = /^09[3-689]\d{7}$/;
        if (!phoneRegex.test(phone)) {
            Swal.fire({
                icon: 'error',
                title: 'رقم الموبايل غير صحيح',
                text: 'يرجى إدخال رقم موبايل سوري صحيح (مثال: 0912345678).',
                confirmButtonColor: '#d33'
            });
            return;
        }

        if (selectedMeals.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'السلة فارغة',
                text: 'يرجى اختيار وجبة واحدة على الأقل قبل إرسال الطلب.',
                confirmButtonColor: '#f39c12'
            });
            return;
        }

        
        let subtotal = 0;
        let itemsList = '';
        
        selectedMeals.forEach(item => {
            subtotal += item.price;
            itemsList += '<div>- ' + item.name + ' (' + item.price.toLocaleString() + ' ل.س)</div>';
        });

        let tax = subtotal * 0.10; 
        let finalTotal = subtotal + tax;

        Swal.fire({
            title: 'تأكيد الطلب',
            html: 
                '<div style="text-align:right; max-height:200px; overflow-y:auto;">' +
                '<h4>الوجبات المختارة:</h4>' +
                itemsList +
                '<hr>' +
                '<p><b>المجموع الفرعي:</b> ' + subtotal.toLocaleString() + ' ل.س</p>' +
                '<p><b>الضريبة (10%):</b> ' + tax.toLocaleString() + ' ل.س</p>' +
                '<p style="font-size:1.2em; color:#0e4f1f;"><b>الإجمالي النهائي:</b> ' + finalTotal.toLocaleString() + ' ل.س</p>' +
                '</div>',
            icon: 'success',
            confirmButtonText: 'تم',
            confirmButtonColor: '#0e4f1f'
        }).then((result) => {
            if (result.isConfirmed) {

                $('#bookingForm')[0].reset();
                selectedMeals = [];
                Swal.fire({
                    title: 'تم الإرسال!',
                    text: 'شكراً لك يا ' + name + ', تم استلام طلبك بنجاح.',
                    icon: 'success',
                    confirmButtonColor: '#0e4f1f'
                });
            }
        });
    });
});