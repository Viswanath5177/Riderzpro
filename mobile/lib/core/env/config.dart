class AppConfig {
  AppConfig._() {
    load();
  }
  static final AppConfig instance = AppConfig._();

  late String apiUrl;
  late String logisticsUrl;
  late String ordersApi;
  late bool useMocks;
  late bool authPasswordEnabled;
  late bool authSocialEnabled;
  late bool firebaseEnabled;
  late String razorpayKeyId;

  void load() {
    apiUrl               = const String.fromEnvironment('API_URL',        defaultValue: 'http://10.0.2.2:8080');
    logisticsUrl         = const String.fromEnvironment('LOGISTICS_URL',  defaultValue: 'http://10.0.2.2:8000');
    ordersApi            = const String.fromEnvironment('ORDERS_API',     defaultValue: 'mock');
    useMocks             = const String.fromEnvironment('USE_MOCKS',      defaultValue: 'true') == 'true';
    authPasswordEnabled  = const String.fromEnvironment('AUTH_PASSWORD_ENABLED', defaultValue: 'false') == 'true';
    authSocialEnabled    = const String.fromEnvironment('AUTH_SOCIAL_ENABLED',   defaultValue: 'true') == 'true';
    firebaseEnabled      = const String.fromEnvironment('FIREBASE_ENABLED',      defaultValue: 'false') == 'true';
    razorpayKeyId        = const String.fromEnvironment('RAZORPAY_KEY_ID', defaultValue: 'rzp_test_placeholder');
  }
}
