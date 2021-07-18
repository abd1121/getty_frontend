
from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('home/', views.index,name='index'),
    path('', views.login_func, name='login_func'),
    path('signup/',views.signup,name='signup'),
    path('logout/', views.logout_func, name='logout_func'),
    path('history/', views.history, name='history'),
    path('delete/<int:id>/', views.delete, name='delete'),
    path('profile_create/', views.profile_create, name='profile_create'),
    path('edit_profile/<int:id>/', views.edit_profile, name='edit_profile'),
    path('delete_profile/<int:id>/', views.delete_profile, name='delete_profile'),
    path('view_profile/<int:id>/', views.view_profile, name='view_profile'),
    path('customize_profile/<int:id>/', views.customize_profile, name='customize_profile'),
    path('reset_password/', auth_views.PasswordResetView.as_view(template_name='reset_password.html'), name='reset_password'),
    path('reset_password_sent/', auth_views.PasswordResetDoneView.as_view(template_name='password_reset_sent.html'), name='password_reset_done'),
    path('reset/<uidb64>/<token>', auth_views.PasswordResetConfirmView.as_view(template_name='password_reset_form.html'), name='password_reset_confirm'),
    path('reset_password_complete/', auth_views.PasswordResetCompleteView.as_view(template_name='password_reset_done.html'), name='password_reset_complete'),
    path('email', views.email, name='email'),
    path('qr_count', views.qr_count, name='qr_count'),
    path('profiles/', views.profiles, name='profiles'),
    path('statistics/', views.statistics, name='statistics'),
    path('delete_social_profile/<int:id>/', views.delete_social_profile, name='delete_social_profile'),
    path('delete_user/<int:id>/', views.delete_user, name='delete_user'),
    path('delete_complete_user/<int:id>/', views.delete_complete_user, name='delete_complete_user'),
    path('multiple_delete/', views.multiple_delete, name='multiple_delete'),
    path('ad_statistics/', views.ad_statistics, name='ad_statistics'),
    path('ad_users/', views.ad_users, name='ad_users'),
    path('ad_scans/', views.ad_scans, name='ad_scans'),
    path('scan_vcf/', views.scan_vcf, name='scan_vcf'),
    path('design/', views.design, name='design'),
path('activate/<uidb64>/<token>/',views.activate, name='activate'),
]
