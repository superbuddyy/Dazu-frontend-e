<template>
  <div class="page404">
    <img src="~/assets/dazu_404.svg" alt="">
    <!-- <b>404</b>
    <div>Nie znaleziono strony</div> -->
    <div><a href="/">Kliknij</a> aby wrócić na stronę główną</div>
  </div>
</template>

<script>
export default {
  name: 'Error404'
}
</script>

<style lang="scss">
  .page404 {
    color: #ffffff;
    // height: calc(100vh - 274px);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    //background-image: url('~assets/header-background.jpg');
    background-position: top;
    background-size: cover;
    background-repeat: no-repeat;
    b {
      font-size: 46px;
      color: #ff19b7;
    }
    a {
      color: #ff19b7;
    }
  }
</style>
