from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import pre_delete
import os
from django.dispatch import receiver
from datetime import datetime
# Create your models here.
class upload_image(models.Model):
    img = models.ImageField(upload_to='save/')
    pid = models.ForeignKey(User, on_delete=models.CASCADE, default=0)
    date = models.DateTimeField(auto_now_add=True)
    cname = models.CharField(blank=True, max_length=100)
    des=models.CharField(blank=True,max_length=500)
    email=models.EmailField(blank=True,max_length=30)
    contact=models.CharField(blank=True,max_length=30)
    address=models.CharField(blank=True,max_length=300)
    def __str__(self):
        return str(self.cname)

class profile(models.Model):
    pid = models.OneToOneField(User,on_delete=models.CASCADE,primary_key=True, default=0)
    img = models.ImageField(upload_to='user/', default='/static/default/default.png')
    vcf_download = models.IntegerField(default=0)
    qr_generated = models.IntegerField(default=0)
    name_style = models.CharField(max_length=40,blank=True,null=True)
    title_style = models.CharField(max_length=40,blank=True,null=True)

    aboutme_color=models.CharField(max_length=40,blank=True,null=True)
    aboutme_caption_style=models.CharField(max_length=40,blank=True,null=True)
    aboutme_text_style=models.CharField(max_length=40,blank=True,null=True)
    cover_color=models.CharField(max_length=40,blank=True,null=True)
    company_backcolor = models.CharField(max_length=40,blank=True,null=True)
    company_head_style=models.CharField(max_length=40,blank=True,null=True)
    comp_detail_style=models.CharField(max_length=40,blank=True,null=True)
    gallery_backcolor=models.CharField(max_length=40,blank=True,null=True)
    gallery_caption_style = models.CharField(max_length=40,blank=True,null=True)
    culture_backcolor = models.CharField(max_length=40,blank=True,null=True)
    culture_headstyle=models.CharField(max_length=40,blank=True,null=True)
    get_touch_style=models.CharField(max_length=40,blank=True,null=True)
    contact_form_backcolor=models.CharField(max_length=40,blank=True,null=True)
    footer_backcolor=models.CharField(max_length=40,blank=True,null=True)
    email_style = models.CharField(max_length=40,blank=True,null=True)
    phone_style = models.CharField(max_length=40,blank=True,null=True)
    qr_style = models.CharField(max_length=40, blank=True, null=True)
    vcf_style = models.CharField(max_length=40, blank=True, null=True)
    share_style = models.CharField(max_length=40, blank=True, null=True)
    def __str__(self):
            return str(self.pid)


class social_profile(models.Model):
    pid = models.OneToOneField(User,on_delete=models.CASCADE,primary_key=True, default=0)
    prof_img = models.ImageField(upload_to='user/')
    cover_img = models.ImageField(upload_to='user/',null=True,blank=True, default='/static/default/cover.jpg' )
    name = models.CharField(max_length=500)
    title = models.CharField(max_length=500)
    about = models.CharField(blank=True, max_length=500)


    company_logo= models.ImageField(upload_to='user/',null=True,blank=True, default='/static/default/default.png' )
    company_name = models.CharField(blank=True, max_length=500)
    about_company = models.CharField(blank=True, max_length=500)

    email = models.EmailField(max_length=500)
    contact = models.CharField(max_length=500)
    facebook_social_links=models.URLField(blank=True,null=True, max_length=500)
    twitter_social_links = models.URLField(blank=True, null=True, max_length=500)
    instagram_social_links = models.URLField(blank=True, null=True, max_length=500)
    linkedin_social_links = models.URLField(blank=True, null=True, max_length=500)
    website_social_links = models.URLField(blank=True, null=True, max_length=500)

    longitude = models.FloatField(blank=True,null=True, max_length=500)
    latitude = models.FloatField(blank=True,null=True, max_length=500)

    video = models.FileField(upload_to='user/',null=True,blank=True)

    qr_type=models.CharField(blank=True,null=True, max_length=1)
    qr_color=models.CharField(blank=True, null=True, max_length=50)
    qr_logo = models.ImageField(upload_to='user/', null=True,blank=True)
    current_datetime=models.DateTimeField(default=datetime.now())
    def __str__(self):
            return str(self.pid)

class gallery(models.Model):
    pid=models.ForeignKey(User,on_delete=models.CASCADE)
    image=models.ImageField(upload_to='user/')
    def __str__(self):
            return str(self.pid)

@receiver(pre_delete, sender=User)
def delete_old_file(sender, instance, **kwargs):
    # on creation, signal callback won't be triggered
    if instance._state.adding and not instance.pk:
        return False
    try:
        obj = User.objects.get(pk=instance.pk)
        try:
          p=profile.objects.get(pid=obj.profile.pid)
        except:
            pass

        up=upload_image.objects.filter(pid=obj.pk)
        gal = gallery.objects.filter(pid=obj.pk)
        if (str(obj.profile.img)).find('default/default.png') == -1:
            if (os.path.isfile(obj.profile.img.path)):
                 os.remove(obj.profile.img.path)
        try:
          if (str(obj.social_profile.prof_img)).find('default/default.png') == -1:
            if (os.path.isfile(obj.social_profile.prof_img.path)):
                os.remove(obj.social_profile.prof_img.path)
          if (str(obj.social_profile.cover_img)).find('default/cover.jpg') == -1:
            if (os.path.isfile(obj.social_profile.cover_img.path)):
                os.remove(obj.social_profile.cover_img.path)
          if (str(obj.social_profile.company_logo)).find('default/default.png') == -1:
            if (os.path.isfile(obj.social_profile.company_logo.path)):
                os.remove(obj.social_profile.company_logo.path)
          if (str(obj.social_profile.video)).find('default/default.png') == -1:
            if (os.path.isfile(obj.social_profile.video.path)):
                os.remove(obj.social_profile.video.path)
          if (str(obj.social_profile.qr_logo)).find('default/default.png') == -1:
            if (os.path.isfile(obj.social_profile.qr_logo.path)):
                os.remove(obj.social_profile.qr_logo.path)
        except:
            pass
    except:
        pass
    try:
      for i in up:
         i.delete()
    except:
        pass
    try:
      for i in gal:
        file = i.image
        if os.path.isfile(file.path):
            os.remove(file.path)
            i.delete()
    except:
        pass
    try:
       p.delete()
    except:
        pass

@receiver(pre_delete, sender=upload_image)
def delete_file(sender, instance, **kwargs):
    # on creation, signal callback won't be triggered
    if instance._state.adding and not instance.pk:
        return False
    try:
        up=upload_image.objects.get(id=instance.pk)
        if (os.path.isfile(up.img.path)):
                 os.remove(up.img.path)
    except:
        pass
