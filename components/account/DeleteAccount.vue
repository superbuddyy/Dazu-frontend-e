<template>
  <div class="delete-account">
    <div class="delete-container">
      <div class="texts">
        <h3>We're sorry you're leaving, we miss you already.</h3>
        <b>Are you sure you want to delete your account?</b>
      </div>
      <div class="emoticon">
        <el-button type="info" class="sad" @click="softDelete">
          Yes, delete
        </el-button>
        <el-button type="primary" class="happy" @click="cancel">
          Cancel, I want to stay here
        </el-button>
        <div class="smiley">
          <div class="eyes">
            <div class="eye" />
            <div class="eye" />
          </div>
          <div class="mouth" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { softDelete } from '@/api/user'

export default {
  name: 'DeleteAccount',
  methods: {
    async softDelete () {
      const result = await softDelete()
      if (result.status === 204) {
        this.$store.dispatch('user/logout')
        this.$router.push('/')
        this.$message({
          message: 'The account will be deleted within 60 days',
          type: 'success',
          duration: 3000
        })
      }
    },
    cancel () {
      this.$emit('toggle-delete-account')
    }
  }
}
</script>

<style lang="scss">
.delete-account {
  position: absolute;
  width: 100%;
  background: #ffffff;
  height: 100%;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;
  z-index: 1;

  .delete-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .texts {
    text-align: center;
    margin: 20px;
  }

  /* Smiley */

  .smiley {
    background: linear-gradient(135deg, rgb(255, 233, 25) 0%, rgb(251, 192, 0) 100%);
    border-radius: 100%;
    padding: 25px;
    position: relative;
    width: 130px;
    height: 130px;
    box-shadow: rgba(211, 165, 110, 0.498039) 0px 30px 30px 1px, rgb(245, 245, 245) 0px 20px 10px 1px;
    margin: 10px auto;
  }

  .mouth {
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    background: #B57700;
    transition: all 300ms cubic-bezier(0.645, 0.045, 0.355, 1);
    border-top-left-radius: 100px;
    border-top-right-radius: 100px;
    border-bottom-left-radius: 100px;
    border-bottom-right-radius: 100px;
    height: 10%;
    width: 40%;
    bottom: 25%;
    margin-left: -20%;
  }

  .eyes {
    width: 100%;
    margin-top: 15%;
    box-sizing: border-box;
    padding: 0 5px;
    transition: all 300ms cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  .eyes .eye {
    width: 20px;
    height: 20px;
    background: #B57700;
    float: left;
    border-radius: 100%;
    position: relative;
  }

  .eyes .eye:nth-of-type(2) {
    float: right;
  }

  .eyes .eye::after {
    content: "";
    display: block;
    position: absolute;
    width: 0%;
    height: 0%;
    background: #fed800;
    transform: rotate(0deg);
    top: -15px;
    left: 5px;
    transition: all 300ms cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  .eyes .eye:first-of-type::after {
    transform: rotate(0deg);
    left: auto;
    right: 5px;
  }

  /* Normal animation */
  .smiley.normal .mouth,
  .sad:hover ~ .smiley .mouth {
    width: 40%;
    height: 20%;
    border-top-left-radius: 100%;
    border-top-right-radius: 100%;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    bottom: 18%;
    left: 50%;
    margin-left: -20%;
    border-bottom: 0;
  }

  .smiley.normal .eyes,
  .sad:hover ~ .smiley .eyes {
    margin-top: 30%
  }

  .smiley.happy .mouth,
  .happy:hover ~ .smiley .mouth {
    animation: move-mouth-down .8s;
    animation-delay: .3s;
    width: 60%;
    height: 30%;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 100px;
    border-bottom-right-radius: 100px;
    box-sizing: border-box;
    position: absolute;
    bottom: 18%;
    left: 40%;
  }

  @keyframes move-mouth-down {
    0% {
      bottom: 18%;
    }

    35% {
      bottom: 16%;
    }

    65% {
      bottom: 16%;
    }

    100% {
      bottom: 18%;
    }
  }

  .smiley.happy .eyes,
  .happy:hover ~ .smiley .eyes {
    animation: move-eyes-down .8s;
    animation-delay: .3s;
  }

  @keyframes move-eyes-down {
    0% {
      margin-top: 15%;
    }

    35% {
      margin-top: 19%;
    }

    65% {
      margin-top: 19%;
    }

    100% {
      margin-top: 15%;
    }
  }

  .smiley.happy .eye:nth-of-type(2),
  .happy:hover ~ .smiley .eye:nth-of-type(2) {
    height: 20px;
    margin-top: 0;
    animation: wink .8s;
    animation-delay: .3s;
  }

  @keyframes wink {
    0% {
      height: 20px;
      margin-top: 0;
    }

    30% {
      height: 3px;
      margin-top: 8px;
    }

    70% {
      height: 3px;
      margin-top: 8px;
    }

    100% {
      height: 20px;
      margin-top: 0;
    }
  }

  .smiley.normal .eye,
  .sad:hover ~ .smiley .eye {
    height: 20px;
    margin-top: 0;
    animation: blink .6s;
    animation-delay: .3s;
  }

  @keyframes blink {
    0% {
      height: 20px;
      margin-top: 0;
    }

    25% {
      height: 2px;
      margin-top: 8px;
    }

    50% {
      height: 20px;
      margin-top: 0;
    }

    75% {
      height: 2px;
      margin-top: 8px;
    }

    100% {
      height: 20px;
      margin-top: 0;
    }
  }
}
</style>
