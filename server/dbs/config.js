export default {
  dbs: 'mongodb://39.108.180.157:27017/meituan',
  redis: {
    get host() {
      return '39.108.180.157';
    },
    get post() {
      return 6379;
    }
  },
  smtp: {
    get host() {
      return 'smtp.qq.com';
    },
    get post() {
      return 587;
    },
    get user() {
      return '835811023@qq.com';
    },
    get pass() {
      return 'ohfzckrluocjbdac';
    },
    get code() {
      return () => {
        return Math.random().toString(16).slice(2, 6).toUpperCase();
      };
    },
    get expire() {
      return () => {
        return new Date().getTime() + 60 * 60 * 1000;
      };
    }
  }
};
