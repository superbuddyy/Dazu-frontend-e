<template>
  <div class="page404">
    <img class="pageImg" src="~/assets/dazu_404.svg" alt="">
    <!-- <b>404</b>
    <div>Nie znaleziono strony</div> -->
    <div><a href="/">Click</a> to return to the home page</div>
  </div>
</template>
<script>
export default {
  name: 'Error404'
}
</script>

<style lang="scss">
  .page404 {
    // color: #ffffff;
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
    img {
      margin: 60px 0px 0px 0px;
    }
  }
  .pageImg {
    margin: 100px 0 0 0;
  }
</style>
