import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthState {
  const AuthState({this.isLoggedIn = false, this.token, this.userId, this.phone, this.email});
  final bool isLoggedIn;
  final String? token;
  final String? userId;
  final String? phone;
  final String? email;

  AuthState copyWith({bool? isLoggedIn, String? token, String? userId, String? phone, String? email}) => AuthState(
    isLoggedIn: isLoggedIn ?? this.isLoggedIn,
    token: token ?? this.token,
    userId: userId ?? this.userId,
    phone: phone ?? this.phone,
    email: email ?? this.email,
  );
}

class AuthNotifier extends AsyncNotifier<AuthState> {
  static const _storage = FlutterSecureStorage();
  static const _tokenKey = 'auth_token';
  static const _userIdKey = 'user_id';

  @override
  Future<AuthState> build() async {
    final token = await _storage.read(key: _tokenKey);
    final userId = await _storage.read(key: _userIdKey);
    if (token != null && token.isNotEmpty) {
      return AuthState(isLoggedIn: true, token: token, userId: userId);
    }
    return const AuthState(isLoggedIn: false);
  }

  Future<void> login({required String token, String? userId, bool persist = true}) async {
    if (persist) {
      await _storage.write(key: _tokenKey, value: token);
      if (userId != null) await _storage.write(key: _userIdKey, value: userId);
    }
    state = AsyncData(AuthState(isLoggedIn: true, token: token, userId: userId));
  }

  Future<void> logout() async {
    await _storage.delete(key: _tokenKey);
    await _storage.delete(key: _userIdKey);
    state = const AsyncData(AuthState(isLoggedIn: false));
  }
}

final authStateProvider = AsyncNotifierProvider<AuthNotifier, AuthState>(AuthNotifier.new);
