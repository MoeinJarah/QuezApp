package ir.mrmoein.quezapplication.repository.jpa;

import ir.mrmoein.quezapplication.model.entity.JwtRefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<JwtRefreshToken, UUID> {

    List<JwtRefreshToken> findAllByRevoked(Boolean revoked);

    Optional<JwtRefreshToken> findByUsername(String username);

}
